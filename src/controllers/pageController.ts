// src/controllers/pageController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';
import { getFromCache, setInCache, invalidateCache } from '../utils/kvCache';

// --- PUBLIC ENDPOINTS ---

export const getPageBySlug = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  const slug = c.req.param('slug');
  const cacheKey = `page_${slug}`;

  // 1. Coba ambil dari KV Cache terlebih dahulu
  const cachedPage = await getFromCache(c.env.CACHE_KV, cacheKey);
  if (cachedPage) {
    return c.json({ source: 'KV_CACHE', data: cachedPage }, 200);
  }

  // 2. Jika tidak ada di cache, ambil dari Database D1
  const prisma = c.get('prisma');
  const page = await prisma.page.findUnique({
    where: { slug: slug, isPublished: true },
    include: {
      widgets: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!page) {
    return c.json({ error: 'Page not found' }, 404);
  }

  // Parsing JSON string dari SQLite kembali menjadi Object untuk frontend
  const formattedPage = {
    ...page,
    widgets: page.widgets.map(widget => ({
      ...widget,
      content: JSON.parse(widget.content)
    }))
  };

  // 3. Simpan hasil ke KV Cache agar request berikutnya cepat
  // Menggunakan TTL default 3600 detik (1 jam)
  await setInCache(c.env.CACHE_KV, cacheKey, formattedPage, 3600);

  return c.json({ source: 'D1_DATABASE', data: formattedPage }, 200);
};


// --- ADMIN PROTECTED ENDPOINTS ---

export const createOrUpdatePage = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { id, title, slug, isPublished, widgets } = body;
    const prisma = c.get('prisma');

    let page;

    if (id) {
      // Update existing page
      page = await prisma.page.update({
        where: { id: id },
        data: { title, slug, isPublished }
      });

      // Hapus widget lama dan ganti dengan yang baru
      await prisma.widget.deleteMany({ where: { pageId: id } });
    } else {
      // Create new page
      page = await prisma.page.create({
        data: { title, slug, isPublished }
      });
    }

    // Insert Widgets jika ada
    if (widgets && Array.isArray(widgets)) {
      const widgetData = widgets.map((w: any, index: number) => ({
        pageId: page.id,
        type: w.type,
        content: JSON.stringify(w.content), // Stringify for SQLite
        sortOrder: index
      }));
      
      await prisma.widget.createMany({ data: widgetData });
    }

    // INVALIDASI CACHE: Hapus cache KV agar perubahan langsung terlihat di frontend
    await invalidateCache(c.env.CACHE_KV, `page_${slug}`);

    return c.json({ message: 'Page saved successfully', data: page }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to save page' }, 500);
  }
};

export const deletePage = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const id = c.req.param('id');
    const prisma = c.get('prisma');

    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return c.json({ error: 'Page not found' }, 404);

    await prisma.page.delete({ where: { id } });

    // INVALIDASI CACHE saat halaman dihapus
    await invalidateCache(c.env.CACHE_KV, `page_${page.slug}`);

    return c.json({ message: 'Page deleted successfully' }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to delete page' }, 500);
  }
};
