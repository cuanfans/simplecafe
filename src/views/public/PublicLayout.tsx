// src/views/public/PublicLayout.tsx

import type { FC } from 'hono/jsx'

interface PublicLayoutProps {
  title: string;
  siteName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  children: any;
}

export const PublicLayout: FC<PublicLayoutProps> = (props) => {
  return (
    <html lang="en" class="scroll-smooth">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title} - {props.siteName}</title>
        
        {/* Tailwind CSS & Custom Brand Colors */}
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
                    dark: '#3E2723',
                    light: '#D7CCC8'
                  }
                },
                fontFamily: {
                  sans: ['Inter', 'system-ui', 'sans-serif'],
                  serif: ['Merriweather', 'serif'],
                }
              }
            }
          }
        `}} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body class="bg-cafe-cream text-cafe-dark font-sans flex flex-col min-h-screen antialiased selection:bg-cafe-green selection:text-white">
        
        {/* STICKY HEADER & NAVIGATION */}
        <header class="sticky top-0 z-50 bg-cafe-cream/80 backdrop-blur-md border-b border-cafe-brown/10 shadow-sm transition-all duration-300" id="main-header">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
              
              {/* Logo / Site Name */}
              <div class="flex-shrink-0 flex items-center gap-2">
                <svg class="w-8 h-8 text-cafe-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <a href="/" class="font-serif text-2xl font-bold text-cafe-brown hover:text-cafe-green transition-colors">
                  {props.siteName}
                </a>
              </div>

              {/* Desktop Menu */}
              <nav class="hidden md:flex space-x-8 items-center">
                <a href="/" class="text-cafe-brown font-medium hover:text-cafe-green transition-colors">Home</a>
                <a href="/about" class="text-cafe-brown font-medium hover:text-cafe-green transition-colors">About</a>
                <a href="/menu" class="text-cafe-brown font-medium hover:text-cafe-green transition-colors">Menu</a>
                <a href="/contact" class="text-cafe-brown font-medium hover:text-cafe-green transition-colors">Contact</a>
                <a href="/menu" class="bg-cafe-green hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Order Now
                </a>
              </nav>

              {/* Mobile Menu Button */}
              <div class="md:hidden flex items-center">
                <button id="mobile-menu-btn" class="text-cafe-brown hover:text-cafe-green focus:outline-none p-2">
                  <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path id="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel (Hidden by default) */}
          <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-cafe-brown/10 absolute w-full shadow-lg">
            <div class="px-4 pt-2 pb-6 space-y-2">
              <a href="/" class="block px-4 py-3 text-base font-medium text-cafe-brown hover:bg-cafe-cream hover:text-cafe-green rounded-lg transition-colors">Home</a>
              <a href="/about" class="block px-4 py-3 text-base font-medium text-cafe-brown hover:bg-cafe-cream hover:text-cafe-green rounded-lg transition-colors">About</a>
              <a href="/menu" class="block px-4 py-3 text-base font-medium text-cafe-brown hover:bg-cafe-cream hover:text-cafe-green rounded-lg transition-colors">Menu</a>
              <a href="/contact" class="block px-4 py-3 text-base font-medium text-cafe-brown hover:bg-cafe-cream hover:text-cafe-green rounded-lg transition-colors">Contact</a>
              <div class="pt-4 pb-2 px-4">
                <a href="/menu" class="block w-full text-center bg-cafe-green text-white px-6 py-3 rounded-xl font-bold shadow-md">
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main class="flex-grow">
          {props.children}
        </main>

        {/* FOOTER */}
        <footer class="bg-cafe-dark text-cafe-light py-12 border-t-4 border-cafe-green mt-auto">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 class="font-serif text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-cafe-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {props.siteName}
              </h3>
              <p class="text-sm leading-relaxed max-w-xs text-gray-400">
                A cozy place for students, professionals, and families to enjoy great coffee and comfortable food.
              </p>
            </div>
            <div>
              <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="/" class="hover:text-cafe-green transition-colors">Home</a></li>
                <li><a href="/about" class="hover:text-cafe-green transition-colors">Our Story</a></li>
                <li><a href="/menu" class="hover:text-cafe-green transition-colors">Full Menu</a></li>
                <li><a href="/contact" class="hover:text-cafe-green transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-bold mb-4 uppercase tracking-wider text-sm">Visit Us</h4>
              <ul class="space-y-3 text-sm text-gray-400">
                <li class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-cafe-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>{props.address || 'Address not set'}</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-cafe-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span>{props.contactPhone || 'Phone not set'}</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-cafe-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span>{props.contactEmail || 'Email not set'}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {props.siteName}. All rights reserved. Powered by Edge Architecture.
          </div>
        </footer>

        {/* Client-side script for Mobile Menu */}
        <script dangerouslySetInnerHTML={{ __html: `
          const btn = document.getElementById('mobile-menu-btn');
          const menu = document.getElementById('mobile-menu');
          const icon = document.getElementById('menu-icon');

          btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            if (menu.classList.contains('hidden')) {
              icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
              icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
          });
        `}} />
      </body>
    </html>
  )
}
