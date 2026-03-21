// src/views/admin/PosView.tsx

import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string | null;
}

interface Table {
  id: string;
  tableNumber: number;
}

interface PosProps {
  userRole: string;
  currencySymbol: string;
  products: Product[];
  tables: Table[];
  activeSessionId: string | null;
}

export const PosView: FC<PosProps> = (props) => {
  // Mengelompokkan produk berdasarkan kategori untuk navigasi Tab
  const categories = Array.from(new Set(props.products.map(p => p.category)));

  return (
    <AdminLayout title="Point of Sale (POS)" userRole={props.userRole}>
      
      {/* Jika Kasir belum membuka sesi shift (Sesi = null), tampilkan peringatan */}
      {!props.activeSessionId && (
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700 font-bold">
                No Active Session! You must open a cash register session before taking orders.
              </p>
            </div>
          </div>
        </div>
      )}

      <div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
        
        {/* LEFT AREA: Product Grid & Categories */}
        <div class="flex-1 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
          
          {/* Category Tabs */}
          <div class="flex overflow-x-auto border-b border-gray-100 p-2 scrollbar-hide bg-gray-50/50">
            <button onclick="filterCategory('ALL')" class="category-btn active px-6 py-2.5 m-1 rounded-lg font-bold text-sm transition-all bg-cafe-brown text-white shadow-md" data-category="ALL">
              All Items
            </button>
            {categories.map(cat => (
              <button onclick={`filterCategory('${cat}')`} class="category-btn px-6 py-2.5 m-1 rounded-lg font-bold text-sm transition-all bg-white text-gray-500 hover:bg-gray-100 border border-gray-200" data-category={cat}>
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div class="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" id="product-grid">
              {props.products.map(product => (
                <div 
                  class="product-card cursor-pointer group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-cafe-green transition-all duration-200"
                  data-category={product.category}
                  onclick={`addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price})`}
                >
                  <div class="h-32 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    ) : (
                      <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    )}
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                  </div>
                  <div class="p-3">
                    <div class="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                    <div class="font-bold text-gray-800 leading-tight mb-2 truncate">{product.name}</div>
                    <div class="font-extrabold text-cafe-green">{props.currencySymbol}{product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT AREA: Shopping Cart & Checkout */}
        <div class="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden shrink-0">
          
          {/* Order Header */}
          <div class="p-4 border-b border-gray-100 bg-cafe-dark text-white">
            <h2 class="font-bold text-lg mb-3">Current Order</h2>
            <select id="table-selector" class="w-full bg-white/10 border border-white/20 text-white rounded-lg p-2.5 font-medium outline-none focus:border-cafe-green focus:ring-1 focus:ring-cafe-green appearance-none">
              <option value="" class="text-gray-900">-- Select Table (Takeaway) --</option>
              {props.tables.map(table => (
                <option value={table.id} class="text-gray-900">Table {table.tableNumber}</option>
              ))}
            </select>
          </div>

          {/* Cart Items */}
          <div class="flex-1 overflow-y-auto p-4 bg-gray-50/50" id="cart-container">
            <div id="empty-cart" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
              <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span class="font-medium text-sm">Cart is empty</span>
            </div>
            <ul id="cart-items" class="space-y-3 hidden">
              {/* Items injected via JS */}
            </ul>
          </div>

          {/* Calculation & Action */}
          <div class="p-4 border-t border-gray-100 bg-white">
            <div class="space-y-2 mb-4 text-sm font-medium text-gray-500">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span id="cart-subtotal" class="text-gray-800">{props.currencySymbol}0.00</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span id="cart-tax" class="text-gray-800">{props.currencySymbol}0.00</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-cafe-dark pt-2 border-t border-gray-100">
                <span>Total</span>
                <span id="cart-total" class="text-cafe-green">{props.currencySymbol}0.00</span>
              </div>
            </div>

            <button 
              id="btn-checkout" 
              onclick="processCheckout()"
              disabled={!props.activeSessionId}
              class="w-full bg-cafe-green hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              Send to Kitchen
            </button>
          </div>

        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const currencySymbol = '${props.currencySymbol}';
        const sessionId = '${props.activeSessionId || ''}';
        const token = localStorage.getItem('admin_token');
        let cart = [];

        // --- FILTER CATEGORY LOGIC ---
        function filterCategory(cat) {
          document.querySelectorAll('.category-btn').forEach(btn => {
            if(btn.dataset.category === cat) {
              btn.classList.replace('bg-white', 'bg-cafe-brown');
              btn.classList.replace('text-gray-500', 'text-white');
              btn.classList.add('shadow-md');
            } else {
              btn.classList.replace('bg-cafe-brown', 'bg-white');
              btn.classList.replace('text-white', 'text-gray-500');
              btn.classList.remove('shadow-md');
            }
          });

          document.querySelectorAll('.product-card').forEach(card => {
            if(cat === 'ALL' || card.dataset.category === cat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }

        // --- CART LOGIC ---
        function addToCart(id, name, price) {
          const existing = cart.find(item => item.id === id);
          if (existing) {
            existing.qty += 1;
          } else {
            cart.push({ id, name, price, qty: 1, note: '' });
          }
          renderCart();
        }

        function updateQty(id, delta) {
          const item = cart.find(item => item.id === id);
          if(item) {
            item.qty += delta;
            if(item.qty <= 0) {
              cart = cart.filter(i => i.id !== id);
            }
            renderCart();
          }
        }

        function addNotePrompt(id) {
          const item = cart.find(item => item.id === id);
          if(item) {
            const note = prompt('Add note for ' + item.name + ' (e.g., Less Sugar):', item.note);
            if(note !== null) {
              item.note = note;
              renderCart();
            }
          }
        }

        function renderCart() {
          const containerEmpty = document.getElementById('empty-cart');
          const containerItems = document.getElementById('cart-items');
          
          if(cart.length === 0) {
            containerEmpty.classList.remove('hidden');
            containerItems.classList.add('hidden');
          } else {
            containerEmpty.classList.add('hidden');
            containerItems.classList.remove('hidden');
            
            containerItems.innerHTML = cart.map(item => \`
              <li class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative group">
                <div class="flex justify-between items-start mb-2">
                  <div class="font-bold text-gray-800 leading-tight pr-6">\${item.name}</div>
                  <div class="font-bold text-cafe-green">\${currencySymbol}\${(item.price * item.qty).toFixed(2)}</div>
                </div>
                \${item.note ? \`<div class="text-xs text-red-500 font-medium italic mb-2">Note: \${item.note}</div>\` : ''}
                <div class="flex justify-between items-center mt-2">
                  <button onclick="addNotePrompt('\${item.id}')" class="text-xs text-gray-400 hover:text-cafe-brown font-semibold flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Note
                  </button>
                  <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <button onclick="updateQty('\${item.id}', -1)" class="w-6 h-6 flex justify-center items-center bg-white rounded text-gray-600 hover:text-red-500 hover:shadow shadow-sm font-bold">-</button>
                    <span class="font-bold text-sm min-w-[1rem] text-center">\${item.qty}</span>
                    <button onclick="updateQty('\${item.id}', 1)" class="w-6 h-6 flex justify-center items-center bg-white rounded text-gray-600 hover:text-cafe-green hover:shadow shadow-sm font-bold">+</button>
                  </div>
                </div>
              </li>
            \`).join('');
          }

          calculateTotals();
        }

        function calculateTotals() {
          const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
          // Tax logic can be fetched dynamically. For MVP, we set it to 0 or 10% based on requirements.
          // Let's assume 0 for simplicity as per DB structure defaults.
          const tax = 0; 
          const total = subtotal + tax;

          document.getElementById('cart-subtotal').textContent = currencySymbol + subtotal.toFixed(2);
          document.getElementById('cart-tax').textContent = currencySymbol + tax.toFixed(2);
          document.getElementById('cart-total').textContent = currencySymbol + total.toFixed(2);
        }

        // --- CHECKOUT LOGIC ---
        async function processCheckout() {
          if (cart.length === 0) return alert('Cart is empty!');
          if (!sessionId) return alert('No active session. Please open a session first.');

          const btn = document.getElementById('btn-checkout');
          btn.disabled = true;
          btn.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...';

          const tableId = document.getElementById('table-selector').value;

          const payload = {
            tableId: tableId === "" ? null : tableId,
            sessionId: sessionId,
            items: cart.map(item => ({
              productId: item.id,
              quantity: item.qty,
              notes: item.note === '' ? null : item.note
            }))
          };

          try {
            const response = await fetch('/api/pos/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              body: JSON.stringify(payload)
            });

            if(!response.ok) throw new Error('Failed to create order');
            
            // Berhasil
            cart = [];
            document.getElementById('table-selector').value = "";
            renderCart();
            
            // Notifikasi Sukses
            alert('Order sent to kitchen successfully!');
            
          } catch(error) {
            alert(error.message);
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Send to Kitchen';
          }
        }
      `}} />
    </AdminLayout>
  )
}
