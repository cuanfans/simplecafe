// src/routes/api.ts

import { Hono } from 'hono';
import { login } from '../controllers/authController';
import { getPageBySlug, createOrUpdatePage, deletePage } from '../controllers/pageController';
import { uploadMedia, getMediaLibrary } from '../controllers/mediaController';
import { getPublicMenu, createOrUpdateProduct, deleteProduct } from '../controllers/productController';
import { getRawMaterials, createOrUpdateRawMaterial, addStockTransaction, setProductRecipe } from '../controllers/inventoryController';
import { createOrder, updateOrderStatus, getKitchenOrders } from '../controllers/orderController';
import { submitContactMessage, updateMessageStatus } from '../controllers/contactController';
import { jwtAuth } from '../middlewares/jwtAuth';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';

type Variables = {
  prisma: PrismaClient;
  user: any; 
}

const apiRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ==========================================
// PUBLIC ROUTES (Dapat diakses Frontend/Pengunjung)
// ==========================================
apiRoutes.post('/auth/login', login);
apiRoutes.get('/pages/:slug', getPageBySlug);
apiRoutes.get('/menu', getPublicMenu);
apiRoutes.post('/contact', submitContactMessage); // Endpoint form kontak

// ==========================================
// PROTECTED ADMIN ROUTES (Wajib JWT & Role Tertentu)
// ==========================================

// --- CMS / Page Management ---
apiRoutes.post('/admin/pages', jwtAuth(['ADMINISTRATOR']), createOrUpdatePage);
apiRoutes.delete('/admin/pages/:id', jwtAuth(['ADMINISTRATOR']), deletePage);

// --- Media Library (Cloudinary) ---
apiRoutes.post('/admin/media', jwtAuth(['ADMINISTRATOR']), uploadMedia);
apiRoutes.get('/admin/media', jwtAuth(['ADMINISTRATOR']), getMediaLibrary);

// --- Product / Menu Management ---
apiRoutes.post('/admin/products', jwtAuth(['ADMINISTRATOR']), createOrUpdateProduct);
apiRoutes.delete('/admin/products/:id', jwtAuth(['ADMINISTRATOR']), deleteProduct);

// --- Inventory & Recipe Management ---
apiRoutes.get('/admin/inventory', jwtAuth(['ADMINISTRATOR', 'KITCHEN']), getRawMaterials);
apiRoutes.post('/admin/inventory', jwtAuth(['ADMINISTRATOR']), createOrUpdateRawMaterial);
apiRoutes.post('/admin/inventory/transaction', jwtAuth(['ADMINISTRATOR', 'KITCHEN']), addStockTransaction);
apiRoutes.post('/admin/recipes', jwtAuth(['ADMINISTRATOR', 'KITCHEN']), setProductRecipe);

// --- POS & Order Management ---
apiRoutes.post('/pos/orders', jwtAuth(['ADMINISTRATOR', 'CASHIER', 'WAITER']), createOrder);
apiRoutes.patch('/pos/orders/:id/status', jwtAuth(['ADMINISTRATOR', 'CASHIER', 'WAITER', 'KITCHEN']), updateOrderStatus);
apiRoutes.get('/kitchen/orders', jwtAuth(['ADMINISTRATOR', 'KITCHEN']), getKitchenOrders);

// --- Contact Inbox Management ---
apiRoutes.patch('/admin/inbox/:id/status', jwtAuth(['ADMINISTRATOR']), updateMessageStatus);

// --- Dashboard Stats ---
apiRoutes.get('/admin/dashboard-stats', jwtAuth(['ADMINISTRATOR']), async (c) => {
  const user = c.get('user');
  const prisma = c.get('prisma');
  const totalOrders = await prisma.order.count();
  
  return c.json({ 
    message: 'Welcome to Administrator Dashboard',
    authenticatedUser: user,
    stats: { totalOrders }
  }, 200);
});

// --- POS Active Sessions ---
apiRoutes.get('/pos/active-sessions', jwtAuth(['ADMINISTRATOR', 'CASHIER']), async (c) => {
  const prisma = c.get('prisma');
  const activeSessions = await prisma.session.findMany({
    where: { status: 'ACTIVE' },
    include: { cashier: { select: { name: true, email: true } } }
  });

  return c.json({ data: activeSessions }, 200);
});

export default apiRoutes;
