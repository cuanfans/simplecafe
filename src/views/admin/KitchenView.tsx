// src/views/admin/KitchenView.tsx

import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  notes: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  table: { tableNumber: number } | null;
  items: OrderItem[];
  createdAt: string;
}

interface KitchenProps {
  userRole: string;
  initialOrders: Order[];
}

export const KitchenView: FC<KitchenProps> = (props) => {
  return (
    <AdminLayout title="Kitchen Display (KDS)" userRole={props.userRole}>
      
      {/* KDS Header & WebSocket Status */}
      <div class="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-cafe-brown/10">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-cafe-dark">Live Orders</h2>
          <span class="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wide">Cooking / Pending</span>
        </div>
        <div class="flex items-center gap-2 text-sm font-medium">
          <span class="text-gray-500">System Status:</span>
          <div id="ws-status" class="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-md transition-colors">
            <span class="relative flex h-3 w-3">
              <span id="ws-ping" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 hidden"></span>
              <span id="ws-dot" class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span id="ws-text">Disconnected</span>
          </div>
        </div>
      </div>

      {/* Orders Grid Container */}
      <div id="orders-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {/* Render Initial Orders from Server (SSR) */}
        {props.initialOrders.map(order => (
          <div id={`order-${order.id}`} class={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${order.status === 'COOKING' ? 'border-t-4 border-t-amber-500 shadow-md' : 'border-t-4 border-t-cafe-green'}`}>
            {/* Card Header */}
            <div class={`px-4 py-3 flex justify-between items-center text-white ${order.status === 'COOKING' ? 'bg-amber-500' : 'bg-cafe-green'}`}>
              <div>
                <div class="text-xs font-semibold opacity-80">{order.orderNumber}</div>
                <div class="text-lg font-bold">Table {order.table?.tableNumber || 'Takeaway'}</div>
              </div>
              <div class="text-right">
                <div class="text-xs font-semibold opacity-80">Time</div>
                <div class="text-sm font-bold order-time" data-time={order.createdAt}>
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div class="p-4 flex-1">
              <ul class="space-y-3 divide-y divide-gray-100">
                {order.items.map(item => (
                  <li class="pt-2 first:pt-0 flex items-start gap-3">
                    <span class="bg-gray-100 text-cafe-dark font-bold px-2 py-1 rounded text-sm min-w-[2rem] text-center">{item.quantity}x</span>
                    <div>
                      <div class="font-semibold text-gray-800">{item.product.name}</div>
                      {item.notes && <div class="text-xs text-red-500 font-medium italic mt-0.5">Note: {item.notes}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
              {order.status === 'ACCEPTED' || order.status === 'PENDING' ? (
                <button onclick={`updateOrderStatus('${order.id}', 'COOKING')`} class="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-bold text-sm transition shadow-sm">
                  Start Cooking
                </button>
              ) : (
                <button onclick={`updateOrderStatus('${order.id}', 'READY')`} class="flex-1 bg-cafe-green hover:bg-green-700 text-white py-2 rounded font-bold text-sm transition shadow-sm">
                  Mark as Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CLIENT-SIDE SCRIPT FOR WEBSOCKET & DOM MANIPULATION */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Menggunakan Token dari LocalStorage yang didapat saat Login
        const token = localStorage.getItem('admin_token');
        let ws;

        function connectWebSocket() {
          // Menyesuaikan protokol wss:// jika di production, ws:// jika lokal
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = \`\${protocol}//\${window.location.host}/ws?role=KITCHEN\`;
          
          ws = new WebSocket(wsUrl);

          const statusText = document.getElementById('ws-text');
          const statusDot = document.getElementById('ws-dot');
          const statusPing = document.getElementById('ws-ping');
          const statusContainer = document.getElementById('ws-status');

          ws.onopen = () => {
            statusText.textContent = 'Connected (Live)';
            statusContainer.classList.replace('bg-red-50', 'bg-green-50');
            statusContainer.classList.replace('text-red-600', 'text-green-600');
            statusDot.classList.replace('bg-red-500', 'bg-green-500');
            statusPing.classList.replace('bg-red-400', 'bg-green-400');
            statusPing.classList.remove('hidden');
          };

          ws.onmessage = (event) => {
            try {
              const payload = JSON.parse(event.data);
              
              if (payload.event === 'NEW_ORDER') {
                // Mainkan suara notifikasi
                playNotificationSound();
                // Refresh data via API untuk mendapatkan detail item yang baru
                fetchAndRenderOrders();
              } else if (payload.event === 'ORDER_STATUS_CHANGED') {
                if (payload.data.newStatus === 'READY') {
                  // Jika pesanan sudah selesai dimasak, hilangkan dari layar KDS
                  const card = document.getElementById('order-' + payload.data.orderId);
                  if (card) card.remove();
                } else {
                  // Refresh untuk status lain
                  fetchAndRenderOrders();
                }
              }
            } catch (e) {
              console.error('WS parse error:', e);
            }
          };

          ws.onclose = () => {
            statusText.textContent = 'Disconnected';
            statusContainer.classList.replace('bg-green-50', 'bg-red-50');
            statusContainer.classList.replace('text-green-600', 'text-red-600');
            statusDot.classList.replace('bg-green-500', 'bg-red-500');
            statusPing.classList.add('hidden');
            // Auto-reconnect setelah 5 detik
            setTimeout(connectWebSocket, 5000);
          };
        }

        async function updateOrderStatus(orderId, newStatus) {
          try {
            const response = await fetch(\`/api/pos/orders/\${orderId}/status\`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              body: JSON.stringify({ status: newStatus })
            });
            
            if (!response.ok) throw new Error('Failed to update status');
            
            // WebSocket server akan menyiarkan event ORDER_STATUS_CHANGED, 
            // sehingga UI akan terupdate secara otomatis di semua layar Kitchen.
          } catch (error) {
            alert('Error: ' + error.message);
          }
        }

        async function fetchAndRenderOrders() {
          try {
            const response = await fetch('/api/kitchen/orders', {
              headers: { 'Authorization': \`Bearer \${token}\` }
            });
            const result = await response.json();
            
            // Logika render ulang container (Untuk keperluan MVP, kita me-reload halaman. 
            // Pada skala yang lebih besar, render ulang spesifik elemen DOM dilakukan di sini).
            window.location.reload(); 
          } catch (error) {
            console.error('Failed to fetch latest orders', error);
          }
        }

        function playNotificationSound() {
          // Bunyikan suara ringan untuk menarik perhatian koki
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        }

        // Jalankan koneksi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', connectWebSocket);
      `}} />
    </AdminLayout>
  )
}
