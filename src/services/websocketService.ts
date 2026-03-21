// src/services/websocketService.ts

import { Context } from 'hono';

// Mendefinisikan struktur klien yang terhubung
export interface ConnectedClient {
  ws: WebSocket;
  role: string; // "ADMINISTRATOR", "CASHIER", "WAITER", "KITCHEN", atau "TABLE_{ID}"
  userId?: string;
}

/**
 * Penyimpanan in-memory pada Edge Isolate Cloudflare.
 * Untuk skala MVP (satu lokasi kafe), request umumnya masuk ke satu titik POP (Point of Presence) Cloudflare yang sama,
 * sehingga Set ini cukup untuk menampung koneksi aktif secara real-time tanpa biaya tambahan.
 */
const activeClients = new Set<ConnectedClient>();

export const handleWebSocketUpgrade = async (c: Context) => {
  const upgradeHeader = c.req.header('Upgrade');
  
  if (upgradeHeader !== 'websocket') {
    return c.json({ error: 'Expected Upgrade: websocket' }, 426);
  }

  // Mengambil role dari query parameter (misal: wss://domain.com/ws?role=KITCHEN)
  const role = c.req.query('role') || 'GUEST';
  const userId = c.req.query('userId');

  // Membuat sepasang WebSocket native Cloudflare
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  // Menerima koneksi di sisi server
  server.accept();

  const clientConfig: ConnectedClient = { ws: server, role, userId };
  activeClients.add(clientConfig);

  server.addEventListener('message', (event) => {
    // Bisa digunakan untuk fitur "Ping/Pong" agar koneksi tidak terputus (keep-alive)
    if (event.data === 'ping') {
      server.send('pong');
    }
  });

  server.addEventListener('close', () => {
    activeClients.delete(clientConfig);
  });

  server.addEventListener('error', () => {
    activeClients.delete(clientConfig);
  });

  // Mengembalikan Response dengan status 101 Switching Protocols
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
};

/**
 * Fungsi utilitas untuk menyiarkan pesan ke spesifik Role
 */
export const broadcastToRole = (targetRole: string, payload: any) => {
  const message = JSON.stringify(payload);
  
  activeClients.forEach((client) => {
    if (client.role === targetRole && client.ws.readyState === WebSocket.READY_STATE_OPEN) {
      try {
        client.ws.send(message);
      } catch (error) {
        // Jika gagal mengirim (koneksi terputus diam-diam), hapus klien dari memori
        activeClients.delete(client);
      }
    }
  });
};

/**
 * Fungsi utilitas untuk menyiarkan pesan ke semua karyawan operasional
 */
export const broadcastToStaff = (payload: any) => {
  const staffRoles = ['ADMINISTRATOR', 'CASHIER', 'WAITER', 'KITCHEN'];
  const message = JSON.stringify(payload);

  activeClients.forEach((client) => {
    if (staffRoles.includes(client.role) && client.ws.readyState === WebSocket.READY_STATE_OPEN) {
      try {
        client.ws.send(message);
      } catch (error) {
        activeClients.delete(client);
      }
    }
  });
};
