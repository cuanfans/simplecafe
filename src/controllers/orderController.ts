// src/controllers/orderController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';
import { broadcastToRole, broadcastToStaff } from '../services/websocketService';

// ==========================================
// CREATE ORDER (POS / SELF-ORDER)
// ==========================================

export const createOrder = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { tableId, sessionId, items } = body; 
    const prisma = c.get('prisma');

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    });
    const orderNumber = `ORD-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

    let subTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const itemSubTotal = product.price * item.quantity;
      subTotal += itemSubTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subTotal: itemSubTotal,
        notes: item.notes
      });
    }

    const taxAmount = 0; 
    const totalAmount = subTotal + taxAmount;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        tableId,
        sessionId,
        status: 'PENDING',
        subTotal,
        taxAmount,
        totalAmount,
        items: {
          create: orderItemsData
        }
      },
      include: { items: true, table: true }
    });

    // --- WEBSOCKET TRIGGER: NEW ORDER ---
    // Beritahu Kasir dan Waiter ada pesanan baru masuk
    broadcastToStaff({
      event: 'NEW_ORDER',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.table?.tableNumber,
        status: order.status
      }
    });

    return c.json({ message: 'Order created successfully', data: order }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create order' }, 500);
  }
};

// ==========================================
// KITCHEN & STATUS MANAGEMENT
// ==========================================

export const updateOrderStatus = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body; // "ACCEPTED", "COOKING", "READY", "DELIVERY", "COMPLETED"
    const prisma = c.get('prisma');

    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        items: { include: { product: { include: { recipes: true } } } },
        table: true
      }
    });

    if (!order) return c.json({ error: 'Order not found' }, 404);

    if (status === 'COOKING' && order.status !== 'COOKING') {
      for (const item of order.items) {
        for (const recipe of item.product.recipes) {
          const totalMaterialNeeded = recipe.quantityUsed * item.quantity;
          
          await prisma.rawMaterial.update({
            where: { id: recipe.materialId },
            data: { currentStock: { decrement: totalMaterialNeeded } }
          });

          await prisma.stockTransaction.create({
            data: {
              materialId: recipe.materialId,
              type: 'CONSUMPTION',
              quantity: totalMaterialNeeded,
              notes: `Consumed for Order ${order.orderNumber}`
            }
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    // --- WEBSOCKET TRIGGER: STATUS UPDATE ---
    const wsPayload = {
      event: 'ORDER_STATUS_CHANGED',
      data: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        tableNumber: order.table?.tableNumber,
        newStatus: status
      }
    };

    // Broadcast ke staf yang relevan berdasarkan status baru
    if (status === 'ACCEPTED' || status === 'COOKING') {
      broadcastToRole('KITCHEN', wsPayload);
    } 
    if (status === 'READY' || status === 'DELIVERY') {
      broadcastToRole('WAITER', wsPayload);
    }
    
    // Broadcast status meja spesifik (berguna jika ada tablet self-order di meja)
    if (order.tableId) {
      broadcastToRole(`TABLE_${order.tableId}`, wsPayload);
    }

    return c.json({ message: `Order status updated to ${status}`, data: updatedOrder }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to update order status' }, 500);
  }
};

export const getKitchenOrders = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  const prisma = c.get('prisma');
  const orders = await prisma.order.findMany({
    where: { 
      status: { in: ['ACCEPTED', 'COOKING'] } 
    },
    include: {
      table: true,
      items: { include: { product: { select: { name: true } } } }
    },
    orderBy: { createdAt: 'asc' }
  });

  return c.json({ data: orders }, 200);
};
