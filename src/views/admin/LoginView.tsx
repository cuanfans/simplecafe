// src/views/admin/LoginView.tsx
import type { FC } from 'hono/jsx'

export const LoginView: FC<{ siteName: string }> = ({ siteName }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login - {siteName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  cafe: {
                    dark: '#2C1810',
                    brown: '#483420',
                    green: '#606C38',
                    cream: '#FEFAE0',
                  }
                }
              }
            }
          }
        ` }} />
      </head>
      <body class="bg-cafe-cream flex items-center justify-center min-h-screen">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-cafe-brown/10">
          <div class="bg-cafe-dark p-8 text-center">
            <h1 class="text-cafe-cream text-3xl font-serif font-bold">{siteName}</h1>
            <p class="text-cafe-cream/70 mt-2 text-sm uppercase tracking-widest">Admin Access</p>
          </div>
          
          <form id="loginForm" class="p-8 space-y-6">
            <div id="errorMessage" class="hidden p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded"></div>
            
            <div>
              <label class="block text-sm font-medium text-cafe-dark">Email Address</label>
              <input type="email" name="email" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-cafe-green focus:border-cafe-green outline-none" placeholder="admin@cafe.com" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-cafe-dark">Password</label>
              <input type="password" name="password" required class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-cafe-green focus:border-cafe-green outline-none" placeholder="••••••••" />
            </div>
            
            <button type="submit" class="w-full bg-cafe-green hover:bg-cafe-dark text-white font-bold py-3 rounded-lg transition-colors duration-300 shadow-md">
              Sign In
            </button>
          </form>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const errorDiv = document.getElementById('errorMessage');

            try {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });

              const result = await res.json();
              
              if (res.ok) {
                // Simpan token di Cookie agar bisa dibaca Middleware backend
                document.cookie = "token=" + result.token + "; path=/; max-age=28800; samesite=strict";
                window.location.href = '/admin/dashboard';
              } else {
                errorDiv.textContent = result.message || 'Login failed';
                errorDiv.classList.remove('hidden');
              }
            } catch (err) {
              errorDiv.textContent = 'Network error. Try again.';
              errorDiv.classList.remove('hidden');
            }
          });
        ` }} />
      </body>
    </html>
  );
};