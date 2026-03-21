// functions/[[path]].ts

import { handle } from 'hono/cloudflare-pages';
import app from '../src/index';

// Menangkap semua request yang masuk ke URL Pages Anda
// lalu melemparnya ke mesin Hono.js di src/index.ts
export const onRequest = handle(app);