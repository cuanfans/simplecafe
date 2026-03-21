// src/views/admin/SettingsView.tsx
import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface Setting {
  key: string;
  value: string;
}

export const SettingsView: FC<{ settings: Setting[], userRole: string }> = ({ settings, userRole }) => {
  return (
    <AdminLayout title="System Settings" userRole={userRole}>
      <div class="max-w-4xl bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
        <div class="p-6 bg-cafe-dark text-cafe-cream">
          <h2 class="text-xl font-bold">Website Configuration</h2>
          <p class="text-sm opacity-70">Changes here reflect immediately on the customer-facing site.</p>
        </div>
        <form class="p-8 space-y-6" id="settingsForm">
          {settings.map(s => (
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-cafe-brown/5 pb-6 last:border-0 last:pb-0">
              <label class="font-bold text-cafe-dark text-xs uppercase tracking-wider">
                {s.key.replace(/_/g, ' ')}
              </label>
              <div class="md:col-span-2">
                <input 
                  type="text" 
                  name={s.key} 
                  value={s.value} 
                  class="w-full px-4 py-2 bg-cafe-cream/20 border border-cafe-brown/10 rounded-lg focus:ring-2 focus:ring-cafe-green outline-none transition-all"
                />
              </div>
            </div>
          ))}
          <div class="pt-6 flex justify-end">
            <button type="submit" class="bg-cafe-green hover:bg-cafe-dark text-white font-bold py-3 px-10 rounded-lg transition-all shadow-md">
              Update All Settings
            </button>
          </div>
        </form>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          // TODO: Implement API call to save settings
          alert('Settings successfully updated!');
        });
      `}} />
    </AdminLayout>
  )
}