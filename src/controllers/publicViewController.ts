// src/controllers/publicViewController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { SettingKeys } from '../config/systemConfig';
import { HomePage } from '../views/public/HomePage';
import { MenuPage } from '../views/public/MenuPage';
import { AboutPage } from '../views/public/AboutPage';
import { ContactPage } from '../views/public/ContactPage';

// Tipe Variabel untuk Native D1
type Variables = {
  db: D1Database;
}

// Fungsi pembantu untuk mengambil konfigurasi website dari D1 Database menggunakan Raw SQL
const getSiteConfig = async (db: D1Database) => {
  const keys = [
    SettingKeys.SITE_NAME,
    SettingKeys.CONTACT_EMAIL,
    SettingKeys.CONTACT_PHONE,
    SettingKeys.ADDRESS,
    SettingKeys.CURRENCY_SYMBOL
  ];

  // Menggunakan klausa IN untuk mengambil multiple key sekaligus
  const placeholders = keys.map(() => '?').join(',');
  const query = `SELECT * FROM "Setting" WHERE "key" IN (${placeholders})`;
  
  // Eksekusi Raw SQL D1
  const { results: settings } = await db.prepare(query).bind(...keys).all();

  const getSetting = (key: string, fallback: string) => {
    const setting = settings.find((s: any) => s.key === key);
    return setting ? (setting.value as string) : fallback;
  };

  return {
    siteName: getSetting(SettingKeys.SITE_NAME, 'Simple Café'),
    currencySymbol: getSetting(SettingKeys.CURRENCY_SYMBOL, '$'),
    contactEmail: getSetting(SettingKeys.CONTACT_EMAIL, 'hello@simplecafe.com'),
    contactPhone: getSetting(SettingKeys.CONTACT_PHONE, '+1 234 567 890'),
    address: getSetting(SettingKeys.ADDRESS, '123 Coffee Street, Cityville')
  };
};

// ==========================================
// RENDER HOME PAGE
// ==========================================
export const renderHomePage = async (c: Context<{ Bindings: Bindings, Variables: Variables }>) => {
  const db = c.get('db');
  
  // Mengambil konfigurasi
  const config = await getSiteConfig(db);

  // Mengambil 3 produk populer/terbaru menggunakan Raw SQL
  const query = `SELECT * FROM "Product" WHERE "isActive" = 1 ORDER BY "createdAt" DESC LIMIT 3`;
  const { results: popularProducts } = await db.prepare(query).all();

  return c.html(HomePage({
    siteName: config.siteName,
    currencySymbol: config.currencySymbol,
    contactEmail: config.contactEmail,
    contactPhone: config.contactPhone,
    address: config.address,
    popularProducts: popularProducts as any
  }));
};

// ==========================================
// RENDER FULL MENU PAGE
// ==========================================
export const renderMenuPage = async (c: Context<{ Bindings: Bindings, Variables: Variables }>) => {
  const db = c.get('db');
  
  const config = await getSiteConfig(db);

  // Mengambil seluruh produk aktif, diurutkan berdasarkan kategori dan nama
  const query = `SELECT * FROM "Product" WHERE "isActive" = 1 ORDER BY "category" ASC, "name" ASC`;
  const { results: products } = await db.prepare(query).all();

  return c.html(MenuPage({
    siteName: config.siteName,
    currencySymbol: config.currencySymbol,
    contactEmail: config.contactEmail,
    contactPhone: config.contactPhone,
    address: config.address,
    products: products as any
  }));
};

// ==========================================
// RENDER ABOUT PAGE
// ==========================================
export const renderAboutPage = async (c: Context<{ Bindings: Bindings, Variables: Variables }>) => {
  const db = c.get('db');
  const config = await getSiteConfig(db);

  return c.html(AboutPage({
    siteName: config.siteName,
    contactEmail: config.contactEmail,
    contactPhone: config.contactPhone,
    address: config.address
  }));
};

// ==========================================
// RENDER CONTACT PAGE
// ==========================================
export const renderContactPage = async (c: Context<{ Bindings: Bindings, Variables: Variables }>) => {
  const db = c.get('db');
  const config = await getSiteConfig(db);

  return c.html(ContactPage({
    siteName: config.siteName,
    contactEmail: config.contactEmail,
    contactPhone: config.contactPhone,
    address: config.address
  }));
};