// src/middlewares/jwtAuth.ts

import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { Bindings } from '../index'

export interface JwtPayload {
  id: string
  role: string
  sessionId?: string 
  exp: number
}

export const jwtAuth = (allowedRoles?: string[]) => {
  return async (c: Context<{ Bindings: Bindings }>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      const cookieHeader = c.req.header('Cookie');
      if (cookieHeader) {
        token = cookieHeader.split('; ').find(row => row.trim().startsWith('token='))?.split('=')[1] || null;
      }
    }

    if (!token) {
      return c.redirect('/admin/login');
    }

    try {
      // PENTING: Menambahkan "HS256" secara eksplisit sebagai parameter ketiga
      const payload = await verify(token, c.env.JWT_SECRET, "HS256") as unknown as JwtPayload;

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
        return c.json({ error: 'Forbidden' }, 403);
      }

      c.set('user', payload);
      await next();
    } catch (error) {
      return c.redirect('/admin/login');
    }
  }
}