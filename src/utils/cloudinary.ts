// src/utils/cloudinary.ts

/**
 * Fungsi pembantu untuk mengunggah gambar ke Cloudinary menggunakan REST API.
 * Sepenuhnya kompatibel dengan Cloudflare Workers (Edge) menggunakan Web Crypto API.
 */
export const uploadToCloudinary = async (
  file: File,
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string = 'simple-cafe-assets'
) => {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  
  // Membuat string yang akan di-hash untuk signature (Sesuai dokumentasi Cloudinary)
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  
  // Web Crypto API untuk SHA-1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Menyiapkan FormData untuk dikirim ke Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};
