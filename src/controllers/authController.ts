// src/controllers/authController.ts

import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { verifyPassword } from '../utils/passwordHash';
import { Bindings } from '../index';

export const login = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    const db = c.env.DB;

    const user = await db.prepare('SELECT * FROM "User" WHERE email = ? AND isActive = 1').bind(email).first<any>();

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    };

    // PENTING: Menambahkan "HS256" secara eksplisit sebagai parameter ketiga
    const token = await sign(payload, c.env.JWT_SECRET, "HS256");

    return c.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, name: user.name, role: user.role } 
    });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
};