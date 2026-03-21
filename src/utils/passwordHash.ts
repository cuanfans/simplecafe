// src/utils/passwordHash.ts

/**
 * Menggunakan Web Crypto API untuk hashing password.
 * Ini memastikan kompatibilitas 100% dengan Cloudflare Workers/Pages
 * tanpa memerlukan dependensi Node.js eksternal.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
};