// src/controllers/adminViewController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { SettingKeys } from '../config/systemConfig';
import { LoginView } from '../views/admin/LoginView';
import { DashboardView } from '../views/admin/DashboardView';
import { KitchenView } from '../views/admin/KitchenView';
import { PosView } from '../views/admin/PosView';
import { InboxView } from '../views/admin/InboxView';
import { InventoryView } from '../views/admin/InventoryView';
import { ProductView } from '../views/admin/ProductView';
import { CmsView } from '../views/admin/CmsView';
import { SettingsView } from '../views/admin/SettingsView';

const getSetting = async (db: D1Database, key: string, fallback: string) => {
  const result = await db.prepare('SELECT value FROM Setting WHERE key = ?').bind(key).first<{ value: string }>();
  return result?.value || fallback;
};

export const renderLoginPage = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const siteName = await getSetting(db, SettingKeys.SITE_NAME, 'Simple Café');
  return c.html(LoginView({ siteName }));
};

export const renderDashboard = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const user = c.get('user');
  const today = new Date().toISOString().split('T')[0] + '%';

  const { count: totalOrdersToday } = await db.prepare('SELECT COUNT(*) as count FROM "Order" WHERE createdAt LIKE ?').bind(today).first() as any;
  const { sum: revenueToday } = await db.prepare('SELECT SUM(totalAmount) as sum FROM "Order" WHERE status = "COMPLETED" AND createdAt LIKE ?').bind(today).first() as any;

  return c.html(DashboardView({ 
    userRole: user?.role || 'ADMINISTRATOR', 
    stats: { totalOrdersToday: totalOrdersToday || 0, revenueToday: `$${(revenueToday || 0).toFixed(2)}` } 
  }));
};

export const renderInventory = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { results: inventory } = await db.prepare('SELECT * FROM RawMaterial ORDER BY name ASC').all();
  return c.html(InventoryView({ inventory: inventory as any, userRole: user?.role || 'ADMINISTRATOR' }));
};

export const renderProducts = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { results: products } = await db.prepare('SELECT * FROM Product ORDER BY category ASC, name ASC').all();
  return c.html(ProductView({ products: products as any, userRole: user?.role || 'ADMINISTRATOR' }));
};

export const renderCms = async (c: Context<{ Bindings: Bindings }>) => {
  const user = c.get('user');
  return c.html(CmsView({ userRole: user?.role || 'ADMINISTRATOR' }));
};

export const renderSettings = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { results: settings } = await db.prepare('SELECT * FROM Setting ORDER BY "key" ASC').all();
  return c.html(SettingsView({ settings: settings as any, userRole: user?.role || 'ADMINISTRATOR' }));
};

export const renderKitchenDisplay = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const { results: orders } = await db.prepare('SELECT * FROM "Order" WHERE status IN ("PENDING", "COOKING")').all();
  return c.html(KitchenView({ userRole: 'ADMINISTRATOR', initialOrders: orders as any }));
};

export const renderPos = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const { results: products } = await db.prepare('SELECT * FROM Product WHERE isActive = 1').all();
  const currency = await getSetting(db, SettingKeys.CURRENCY_SYMBOL, '$');
  return c.html(PosView({ userRole: 'ADMINISTRATOR', currencySymbol: currency, products: products as any, tables: [], activeSessionId: null }));
};

export const renderInbox = async (c: Context<{ Bindings: Bindings }>) => {
  const db = c.env.DB;
  const user = c.get('user');
  const { results: messages } = await db.prepare('SELECT * FROM ContactMessage ORDER BY createdAt DESC').all();
  return c.html(InboxView({ userRole: user?.role || 'ADMINISTRATOR', messages: messages as any }));
};