// src/views/admin/InboxView.tsx

import type { FC } from 'hono/jsx'
import { AdminLayout } from './AdminLayout'

interface Message {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  message: string;
  status: string; // UNREAD, READ, FOLLOWED_UP
  createdAt: string;
}

interface InboxProps {
  userRole: string;
  messages: Message[];
}

export const InboxView: FC<InboxProps> = (props) => {
  return (
    <AdminLayout title="Customer Inbox" userRole={props.userRole}>
      
      <div class="bg-white rounded-2xl shadow-sm border border-cafe-brown/10 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 class="text-lg font-bold text-cafe-dark">Messages & Enquiries</h2>
          <span class="px-3 py-1 bg-cafe-green/10 text-cafe-green text-xs font-bold rounded-full">
            {props.messages.filter(m => m.status === 'UNREAD').length} Unread
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th class="px-6 py-4 font-semibold border-b border-gray-100">Date</th>
                <th class="px-6 py-4 font-semibold border-b border-gray-100">Customer</th>
                <th class="px-6 py-4 font-semibold border-b border-gray-100 w-1/3">Message</th>
                <th class="px-6 py-4 font-semibold border-b border-gray-100">Status</th>
                <th class="px-6 py-4 font-semibold border-b border-gray-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {props.messages.length > 0 ? (
                props.messages.map(msg => (
                  <tr class={`hover:bg-gray-50 transition ${msg.status === 'UNREAD' ? 'bg-blue-50/30 font-medium' : ''}`}>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-bold text-gray-900">{msg.firstName} {msg.lastName || ''}</div>
                      <div class="text-xs text-gray-500">{msg.email}</div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      <div class="line-clamp-2">{msg.message}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select 
                        class={`text-xs font-bold rounded-full px-3 py-1 border-none focus:ring-2 outline-none cursor-pointer appearance-none ${
                          msg.status === 'UNREAD' ? 'bg-red-100 text-red-700' :
                          msg.status === 'READ' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}
                        onchange={`updateStatus('${msg.id}', this.value)`}
                      >
                        <option value="UNREAD" selected={msg.status === 'UNREAD'}>UNREAD</option>
                        <option value="READ" selected={msg.status === 'READ'}>READ</option>
                        <option value="FOLLOWED_UP" selected={msg.status === 'FOLLOWED_UP'}>FOLLOWED UP</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button onclick={`alert('Message details:\\n\\nFrom: ${msg.firstName} (${msg.email})\\n\\n${msg.message}')`} class="text-cafe-green hover:text-green-700 font-bold">
                        Read Full
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan={5} class="px-6 py-12 text-center text-gray-400 italic">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        async function updateStatus(id, newStatus) {
          const token = localStorage.getItem('admin_token');
          try {
            const res = await fetch(\`/api/admin/inbox/\${id}/status\`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              body: JSON.stringify({ status: newStatus })
            });
            if(res.ok) {
               window.location.reload();
            } else {
               alert('Failed to update status');
            }
          } catch(e) {
            alert(e.message);
          }
        }
      `}} />
    </AdminLayout>
  )
}
