// src/routes/adminViews.ts

import { Hono } from 'hono';
import { 
  renderLoginPage, 
  renderDashboard, 
  renderKitchenDisplay, 
  renderPos, 
  renderInbox,
  renderInventory,
  renderProducts,
  renderCms,
  renderSettings
} from '../controllers/adminViewController';
import { jwtAuth } from '../middlewares/jwtAuth';
import { Bindings } from '../index';

type Variables = {
  db: D1Database;
  user: any; 
}

const viewRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ==========================================
// PUBLIC ADMIN ROUTES
// ==========================================
viewRoutes.get('/login', renderLoginPage);

// ==========================================
// PROTECTED ADMIN ROUTES (Wajib JWT + Role)
// ==========================================
viewRoutes.get('/dashboard', jwtAuth(['ADMINISTRATOR']), renderDashboard);
viewRoutes.get('/kitchen', jwtAuth(['ADMINISTRATOR', 'KITCHEN']), renderKitchenDisplay);
viewRoutes.get('/pos', jwtAuth(['ADMINISTRATOR', 'CASHIER', 'WAITER']), renderPos);
viewRoutes.get('/inbox', jwtAuth(['ADMINISTRATOR']), renderInbox);

// Rute yang sebelumnya 404:
viewRoutes.get('/inventory', jwtAuth(['ADMINISTRATOR']), renderInventory);
viewRoutes.get('/products', jwtAuth(['ADMINISTRATOR']), renderProducts);
viewRoutes.get('/cms', jwtAuth(['ADMINISTRATOR']), renderCms);
viewRoutes.get('/settings', jwtAuth(['ADMINISTRATOR']), renderSettings);

export default viewRoutes;