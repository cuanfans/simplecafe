// src/views/admin/AdminLayout.tsx

import type { FC } from 'hono/jsx'

interface LayoutProps {
  title: string;
  userRole: string;
  children: any;
}

export const AdminLayout: FC<LayoutProps> = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title} - Simple Café Workspace</title>
        
        {/* Menggunakan Tailwind CDN untuk kemudahan Edge Rendering. 
            Konfigurasi kustom memuat warna Cokelat, Krem, dan Hijau sesuai spesifikasi. */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  cafe: {
                    brown: '#5D4037',
                    cream: '#FFF8E1',
                    green: '#2E7D32',
                    dark: '#3E2723'
                  }
                }
              }
            }
          }
        `}} />
      </head>
      <body class="bg-cafe-cream text-gray-900 font-sans flex h-screen overflow-hidden antialiased">
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside class="w-64 bg-cafe-dark text-white flex-col hidden md:flex shadow-xl z-40">
            <div class="p-6 text-xl font-bold tracking-wider border-b border-white/10 flex items-center gap-3">
                <svg class="w-6 h-6 text-cafe-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Simple Café
            </div>
            <nav class="flex-1 overflow-y-auto py-4">
                <ul class="space-y-1">
                    <li><a href="/admin/dashboard" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Dashboard</a></li>
                    
                    {/* Logika render menu berdasarkan Role dapat ditambahkan di sini */}
                    <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Operations</div>
                    <li><a href="/admin/pos" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Point of Sale (POS)</a></li>
                    <li><a href="/admin/kitchen" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Kitchen Display (KDS)</a></li>
                    <li><a href="/admin/inventory" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Inventory & Recipes</a></li>
                    
                    <div class="px-6 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</div>
                    <li><a href="/admin/products" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Products & Menu</a></li>
                    <li><a href="/admin/cms" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Website Pages</a></li>
                    <li><a href="/admin/settings" class="block px-6 py-3 hover:bg-white/10 transition border-l-4 border-transparent hover:border-cafe-green">Settings & Kiosk</a></li>
                </ul>
            </nav>
            <div class="p-4 border-t border-white/10 bg-black/20">
                <div class="text-xs text-gray-400 mb-1">Logged in as</div>
                <div class="text-sm font-semibold text-white mb-3 uppercase">{props.userRole}</div>
                <button class="w-full bg-red-600/80 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition flex justify-center items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main class="flex-1 flex flex-col h-screen relative bg-transparent">
            
            {/* STICKY HEADER & MOBILE MENU (Glassmorphism Effect) */}
            <header class="sticky top-0 z-50 bg-cafe-cream/80 backdrop-blur-md border-b border-cafe-brown/10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div class="flex items-center gap-4">
                    <button class="md:hidden text-cafe-brown hover:text-cafe-green transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h1 class="text-xl md:text-2xl font-bold text-cafe-dark">{props.title}</h1>
                </div>
                
                <div class="flex items-center space-x-4">
                    <button class="relative p-2 text-cafe-brown hover:bg-cafe-brown/10 rounded-full transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-cafe-cream"></span>
                    </button>
                </div>
            </header>

            {/* DYNAMIC CONTENT INJECTION */}
            <div class="flex-1 overflow-y-auto p-4 md:p-8">
                {props.children}
            </div>
            
        </main>
      </body>
    </html>
  )
}
