// src/controllers/mediaController.ts

import { Context } from 'hono';
import { Bindings } from '../index';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinary';
import { SettingKeys } from '../config/systemConfig';

export const uploadMedia = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient, user: any } }>) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No valid file uploaded' }, 400);
    }

    const prisma = c.get('prisma');
    const user = c.get('user');

    // Ambil konfigurasi Cloudinary dari Database
    const cloudNameSetting = await prisma.setting.findUnique({ where: { key: SettingKeys.CLOUDINARY_CLOUD_NAME } });
    const folderSetting = await prisma.setting.findUnique({ where: { key: SettingKeys.CLOUDINARY_FOLDER } });

    const cloudName = cloudNameSetting?.value || c.env.CLOUDINARY_API_KEY; // Fallback jika setting DB kosong
    const folder = folderSetting?.value || 'simple-cafe-assets';

    // Proses upload ke Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(
      file,
      cloudName,
      c.env.CLOUDINARY_API_KEY,
      c.env.CLOUDINARY_API_SECRET,
      folder
    );

    // Simpan metadata ke D1 Database
    const mediaRecord = await prisma.media.create({
      data: {
        publicId: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
        format: cloudinaryResponse.format,
        bytes: cloudinaryResponse.bytes,
        folder: cloudinaryResponse.folder,
        uploadedBy: user.id
      }
    });

    return c.json({ message: 'File uploaded successfully', data: mediaRecord }, 201);
  } catch (error: any) {
    return c.json({ error: 'Upload failed', details: error.message }, 500);
  }
};

export const getMediaLibrary = async (c: Context<{ Bindings: Bindings, Variables: { prisma: PrismaClient } }>) => {
  const prisma = c.get('prisma');
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return c.json({ data: media }, 200);
};
