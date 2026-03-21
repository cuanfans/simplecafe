// src/controllers/productController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';
import { getFromCache, setInCache, invalidateCache } from '../utils/kvCache';

const MENU_CACHE_KEY = 'public_menu_list';

// --- PUBLIC ENDPOINTS ---

export const getPublicMenu = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  // 1. Coba ambil dari KV Cache
  const cachedMenu = await getFromCache(c.env.CACHE_KV, MENU_CACHE_KEY);
  if (cachedMenu) {
    return c.json({ source: 'KV_CACHE', data: cachedMenu }, 200);
  }

  // 2. Jika tidak ada di cache, ambil dari Database D1
  const prisma = c.get('prisma');
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { category: 'asc' } // Mengelompokkan berdasarkan kategori (Breakfast, Drinks, dll)
  });

  // 3. Simpan ke KV Cache (TTL 30 menit = 1800 detik)
  await setInCache(c.env.CACHE_KV, MENU_CACHE_KEY, products, 1800);

  return c.json({ source: 'D1_DATABASE', data: products }, 200);
};

// --- ADMIN PROTECTED ENDPOINTS ---

export const createOrUpdateProduct = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { id, name, description, price, category, imageUrl, isActive } = body;
    const prisma = c.get('prisma');

    let product;

    if (id) {
      product = await prisma.product.update({
        where: { id: id },
        data: { name, description, price, category, imageUrl, isActive }
      });
    } else {
      product = await prisma.product.create({
        data: { name, description, price, category, imageUrl, isActive }
      });
    }

    // INVALIDASI CACHE KARENA ADA PERUBAHAN MENU
    await invalidateCache(c.env.CACHE_KV, MENU_CACHE_KEY);

    return c.json({ message: 'Product saved successfully', data: product }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to save product' }, 500);
  }
};

export const deleteProduct = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const id = c.req.param('id');
    const prisma = c.get('prisma');

    await prisma.product.delete({ where: { id } });

    // INVALIDASI CACHE
    await invalidateCache(c.env.CACHE_KV, MENU_CACHE_KEY);

    return c.json({ message: 'Product deleted successfully' }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to delete product' }, 500);
  }
};
