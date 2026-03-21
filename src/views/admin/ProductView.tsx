// src/views/admin/ProductView.tsx
import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: number;
}

export const ProductView: FC<{ products: Product[], userRole: string }> = ({ products, userRole }) => {
  return (
    <AdminLayout title="Product Management" userRole={userRole}>
      <div class="bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
        <div class="p-6 border-b border-cafe-brown/10 flex justify-between items-center">
          <h2 class="text-xl font-bold text-cafe-dark">Menu Items</h2>
          <button class="bg-cafe-green text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-cafe-dark transition-all">
            + New Product
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-cafe-cream/50 text-cafe-dark uppercase text-xs font-bold">
              <tr>
                <th class="px-6 py-4">Product Name</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4 text-center">Price</th>
                <th class="px-6 py-4 text-center">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cafe-brown/5 text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colspan={5} class="px-6 py-10 text-center text-gray-400 italic">No products found.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr class="hover:bg-cafe-cream/20 transition-colors">
                    <td class="px-6 py-4 font-medium text-cafe-dark">{product.name}</td>
                    <td class="px-6 py-4">
                      <span class="bg-cafe-cream px-2 py-1 rounded text-[10px] font-bold uppercase text-cafe-brown">
                        {product.category}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center font-bold text-cafe-green">
                      ${product.price.toFixed(2)}
                    </td>
                    <td class="px-6 py-4 text-center">
                      {product.isActive ? (
                        <span class="text-green-600 font-bold">Active</span>
                      ) : (
                        <span class="text-gray-400 font-bold">Inactive</span>
                      )}
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="text-cafe-green font-bold hover:underline">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}