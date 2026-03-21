// src/controllers/contactController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';

// Diterima dari form halaman publik
export const submitContactMessage = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, message } = body;
    const prisma = c.get('prisma');

    if (!firstName || !email || !message) {
      return c.json({ error: 'First name, email, and message are required' }, 400);
    }

    const newContact = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        message,
        status: 'UNREAD'
      }
    });

    return c.json({ message: 'Message sent successfully', data: newContact }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send message' }, 500);
  }
};

// Mengubah status di halaman admin Inbox (UNREAD, READ, FOLLOWED_UP)
export const updateMessageStatus = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    const prisma = c.get('prisma');

    if (!['UNREAD', 'READ', 'FOLLOWED_UP'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });

    return c.json({ message: 'Status updated', data: updatedMessage }, 200);
  } catch (error) {
    return c.json({ error: 'Failed to update status' }, 500);
  }
};
