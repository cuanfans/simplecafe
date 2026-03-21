// src/views/admin/DashboardView.tsx

import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface DashboardProps {
  userRole: string;
  stats: {
    totalOrdersToday: number;
    activeSessions: number;
    lowStockCount: number;
    revenueToday: string;
  }
}

export const DashboardView: FC<DashboardProps> = (props) => {
  return (
    <AdminLayout title="Dashboard Summary" userRole={props.userRole}>
      
      {/* KPI CARDS (Key Performance Indicators) */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total Orders */}
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-cafe-brown/10 flex flex-col relative overflow-hidden group hover:shadow-md transition">
            <div class="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-500"></div>
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Orders</h3>
                <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
            </div>
            <div class="text-3xl font-extrabold text-cafe-dark">{props.stats.totalOrdersToday}</div>
            <div class="text-xs text-green-600 mt-2 font-medium">+12% from yesterday</div>
        </div>

        {/* Card 2: Revenue Today */}
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-cafe-brown/10 flex flex-col relative overflow-hidden group hover:shadow-md transition">
            <div class="absolute right-0 top-0 w-24 h-24 bg-cafe-green/10 rounded-bl-full -z-10 group-hover:scale-110 transition duration-500"></div>
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-gray-500 text-xs font-bold uppercase tracking-wider">Revenue Today</h3>
                <div class="p-2 bg-cafe-green/20 text-cafe-green rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            </div>
            <div class="text-3xl font-extrabold text-cafe-dark">{props.stats.revenueToday}</div>
            <div class="text-xs text-gray-400 mt-2 font-medium">Estimated based on completed</div>
        </div>

        {/* Card 3: Active Sessions */}
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-cafe-brown/10 flex flex-col relative overflow-hidden group hover:shadow-md transition">
            <div class="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-500"></div>
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Shifts</h3>
                <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
            </div>
            <div class="text-3xl font-extrabold text-cafe-dark">{props.stats.activeSessions}</div>
            <div class="text-xs text-purple-600 mt-2 font-medium">Cashiers currently online</div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div class="bg-white rounded-2xl shadow-sm p-6 border border-cafe-brown/10 flex flex-col relative overflow-hidden group hover:shadow-md transition border-l-4 border-l-red-500">
            <div class="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-500"></div>
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-gray-500 text-xs font-bold uppercase tracking-wider">Low Stock Items</h3>
                <div class="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
            </div>
            <div class="text-3xl font-extrabold text-cafe-dark">{props.stats.lowStockCount}</div>
            <div class="text-xs text-red-500 mt-2 font-medium">Requires immediate review</div>
        </div>
      </div>

      {/* RECENT ACTIVITY & SYSTEM STATUS */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Activity Table */}
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
            <div class="px-6 py-5 border-b border-cafe-brown/10 flex justify-between items-center bg-gray-50/50">
                <h2 class="text-lg font-bold text-cafe-dark">Recent Incoming Orders</h2>
                <a href="/admin/pos" class="text-sm text-cafe-brown hover:text-cafe-green font-medium transition">View All →</a>
            </div>
            <div class="p-6 text-center text-gray-500 italic">
                Data visualizer table will be rendered here via API integration.
            </div>
        </div>

        {/* Right Col: Quick Actions */}
        <div class="bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
            <div class="px-6 py-5 border-b border-cafe-brown/10 bg-gray-50/50">
                <h2 class="text-lg font-bold text-cafe-dark">Quick Actions</h2>
            </div>
            <div class="p-6 space-y-3">
                <button class="w-full flex items-center gap-3 p-3 bg-cafe-cream/30 hover:bg-cafe-cream text-cafe-brown rounded-xl transition border border-cafe-brown/20">
                    <div class="bg-cafe-brown text-white p-2 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span class="font-medium">Create New Order (POS)</span>
                </button>
                <button class="w-full flex items-center gap-3 p-3 bg-cafe-cream/30 hover:bg-cafe-cream text-cafe-brown rounded-xl transition border border-cafe-brown/20">
                    <div class="bg-cafe-green text-white p-2 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <span class="font-medium">Upload Media/Logo</span>
                </button>
                <button class="w-full flex items-center gap-3 p-3 bg-cafe-cream/30 hover:bg-cafe-cream text-cafe-brown rounded-xl transition border border-cafe-brown/20">
                    <div class="bg-amber-600 text-white p-2 rounded-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                    </div>
                    <span class="font-medium">Edit CMS Pages</span>
                </button>
            </div>
        </div>

      </div>
    </AdminLayout>
  )
}
