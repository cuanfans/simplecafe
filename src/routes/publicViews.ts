// src/routes/publicViews.ts

import { Hono } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';
import { renderHomePage, renderMenuPage, renderAboutPage, renderContactPage } from '../controllers/publicViewController';

type Variables = {
  prisma: PrismaClient;
}

const publicRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Mendaftarkan URL statis untuk pengunjung kafe
publicRoutes.get('/', renderHomePage);
publicRoutes.get('/about', renderAboutPage);
publicRoutes.get('/menu', renderMenuPage);
publicRoutes.get('/contact', renderContactPage);

export default publicRoutes;
