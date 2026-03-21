// src/controllers/inventoryController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';

// ==========================================
// RAW MATERIAL (BAHAN BAKU)
// ==========================================

export const getRawMaterials = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  const prisma = c.get('prisma');
  const materials = await prisma.rawMaterial.findMany({
    orderBy: { name: 'asc' }
  });
  return c.json({ data: materials }, 200);
};

export const createOrUpdateRawMaterial = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { id, name, unit, minimumStock } = body;
    const prisma = c.get('prisma');

    let material;
    if (id) {
      material = await prisma.rawMaterial.update({
        where: { id },
        data: { name, unit, minimumStock: parseFloat(minimumStock) }
      });
    } else {
      material = await prisma.rawMaterial.create({
        data: { name, unit, minimumStock: parseFloat(minimumStock), currentStock: 0 }
      });
    }

    return c.json({ message: 'Raw material saved', data: material }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to save raw material' }, 500);
  }
};

// ==========================================
// STOCK TRANSACTIONS (PEMBELIAN / PENYESUAIAN STOK)
// ==========================================

export const addStockTransaction = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { materialId, type, quantity, notes } = body; 
    // type enum string: "PURCHASE", "SPOILAGE", "ADJUSTMENT"
    const prisma = c.get('prisma');

    const qtyFloat = parseFloat(quantity);

    // D1 SQLite tidak mendukung transaksi kompleks berlapis dengan baik di beberapa edge case, 
    // jadi kita gunakan eksekusi berurutan yang aman.
    const material = await prisma.rawMaterial.findUnique({ where: { id: materialId } });
    if (!material) return c.json({ error: 'Material not found' }, 404);

    let newStock = material.currentStock;
    if (type === 'PURCHASE' || type === 'ADJUSTMENT') {
      newStock += qtyFloat;
    } else if (type === 'SPOILAGE') {
      newStock -= qtyFloat;
    }

    // Buat riwayat transaksi
    const transaction = await prisma.stockTransaction.create({
      data: {
        materialId,
        type,
        quantity: qtyFloat,
        notes
      }
    });

    // Update stok saat ini
    await prisma.rawMaterial.update({
      where: { id: materialId },
      data: { currentStock: newStock }
    });

    return c.json({ message: 'Stock updated successfully', data: transaction }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to process stock transaction' }, 500);
  }
};

// ==========================================
// RECIPE MANAGEMENT (MANAJEMEN RESEP)
// ==========================================

export const setProductRecipe = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { productId, recipes } = body; // recipes = array of { materialId, quantityUsed }
    const prisma = c.get('prisma');

    // Hapus resep lama untuk produk ini
    await prisma.recipe.deleteMany({
      where: { productId }
    });

    // Masukkan susunan resep baru
    if (recipes && recipes.length > 0) {
      const recipeData = recipes.map((r: any) => ({
        productId: productId,
        materialId: r.materialId,
        quantityUsed: parseFloat(r.quantityUsed)
      }));

      await prisma.recipe.createMany({ data: recipeData });
    }

    return c.json({ message: 'Recipe updated successfully' }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to set recipe' }, 500);
  }
};
