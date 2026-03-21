// src/views/admin/CmsView.tsx
import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

export const CmsView: FC<{ userRole: string }> = ({ userRole }) => {
  return (
    <AdminLayout title="CMS Management" userRole={userRole}>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-2xl border border-cafe-brown/10 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-cafe-cream rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-cafe-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 class="font-bold text-lg text-cafe-dark mb-2">Homepage Content</h3>
          <p class="text-sm text-gray-500 mb-8">Edit banners, hero sections, and featured items shown on the landing page.</p>
          <button class="w-full py-3 bg-cafe-cream text-cafe-dark font-bold rounded-lg border border-cafe-brown/10 hover:bg-cafe-brown hover:text-white transition-all">
            Edit Homepage
          </button>
        </div>
        
        <div class="bg-white p-8 rounded-2xl border border-cafe-brown/10 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 bg-cafe-cream rounded-xl flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-cafe-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-bold text-lg text-cafe-dark mb-2">Pages Information</h3>
          <p class="text-sm text-gray-500 mb-8">Update "About Us", "Our Story", and static contact page information.</p>
          <button class="w-full py-3 bg-cafe-cream text-cafe-dark font-bold rounded-lg border border-cafe-brown/10 hover:bg-cafe-brown hover:text-white transition-all">
            Manage Pages
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}