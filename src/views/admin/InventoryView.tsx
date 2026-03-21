// src/views/admin/InventoryView.tsx
import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
}

export const InventoryView: FC<{ inventory: RawMaterial[], userRole: string }> = ({ inventory, userRole }) => {
  return (
    <AdminLayout title="Inventory Management" userRole={userRole}>
      <div class="bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
        <div class="p-6 border-b border-cafe-brown/10 flex justify-between items-center">
          <h2 class="text-xl font-bold text-cafe-dark">Stock Materials</h2>
          <button class="bg-cafe-green text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-cafe-dark transition-all">
            + Add Material
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-cafe-cream/50 text-cafe-dark uppercase text-xs font-bold">
              <tr>
                <th class="px-6 py-4">Material Name</th>
                <th class="px-6 py-4 text-center">Current Stock</th>
                <th class="px-6 py-4 text-center">Min. Stock</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cafe-brown/5 text-sm">
              {inventory.length === 0 ? (
                <tr>
                  <td colspan={5} class="px-6 py-10 text-center text-gray-400 italic">No inventory data found.</td>
                </tr>
              ) : (
                inventory.map(item => {
                  const isLow = item.currentStock <= item.minimumStock;
                  return (
                    <tr class="hover:bg-cafe-cream/20 transition-colors">
                      <td class="px-6 py-4 font-medium text-cafe-dark">{item.name}</td>
                      <td class="px-6 py-4 text-center">{item.currentStock} {item.unit}</td>
                      <td class="px-6 py-4 text-center">{item.minimumStock} {item.unit}</td>
                      <td class="px-6 py-4">
                        {isLow ? (
                          <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">Low Stock</span>
                        ) : (
                          <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Healthy</span>
                        )}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button class="text-cafe-green font-bold mr-3 hover:underline">Edit</button>
                        <button class="text-red-600 font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}