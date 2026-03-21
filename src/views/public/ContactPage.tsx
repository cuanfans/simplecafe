// src/views/public/ContactPage.tsx

import type { FC } from 'hono/jsx'
import { PublicLayout } from './PublicLayout'

interface ContactProps {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export const ContactPage: FC<ContactProps> = (props) => {
  return (
    <PublicLayout 
      title="Contact Us" 
      siteName={props.siteName}
      contactEmail={props.contactEmail}
      contactPhone={props.contactPhone}
      address={props.address}
    >
      <div class="bg-white min-h-screen py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center mb-16">
            <h1 class="font-serif text-4xl md:text-5xl font-bold text-cafe-dark mb-4">Get in Touch</h1>
            <p class="text-gray-500 text-lg">We would love to hear from you. Drop us a message or visit our café.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white rounded-3xl overflow-hidden shadow-xl border border-cafe-brown/10">
            
            {/* Left: Contact Information */}
            <div class="bg-cafe-brown text-white p-10 md:p-16 flex flex-col justify-between relative overflow-hidden">
              <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
              
              <div class="relative z-10">
                <h2 class="font-serif text-3xl font-bold mb-8 text-cafe-cream">Contact Information</h2>
                
                <div class="space-y-8">
                  <div class="flex items-start gap-4">
                    <div class="p-3 bg-cafe-green/20 rounded-full text-cafe-green">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-cafe-light mb-1">Our Location</h3>
                      <p class="text-lg">{props.address}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-4">
                    <div class="p-3 bg-cafe-green/20 rounded-full text-cafe-green">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-cafe-light mb-1">Call Us</h3>
                      <p class="text-lg">{props.contactPhone}</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-4">
                    <div class="p-3 bg-cafe-green/20 rounded-full text-cafe-green">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-cafe-light mb-1">Email Us</h3>
                      <p class="text-lg">{props.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div class="relative z-10 mt-16 flex gap-4">
                 <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-green transition text-white">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                 </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div class="p-10 md:p-16 relative">
              <h2 class="font-serif text-3xl font-bold mb-8 text-cafe-dark">Send a Message</h2>
              
              <div id="form-alert" class="hidden mb-6 p-4 rounded-xl text-sm font-bold"></div>

              <form id="contact-form" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" id="firstName" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent transition" placeholder="John" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" id="lastName" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent transition" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent transition" placeholder="john@example.com" required />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea id="message" rows={4} class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent transition resize-none" placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" id="submit-btn" class="w-full bg-cafe-green hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const btn = document.getElementById('submit-btn');
          const alertBox = document.getElementById('form-alert');
          
          const payload = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
          };

          btn.disabled = true;
          btn.innerHTML = 'Sending...';
          alertBox.classList.add('hidden');
          alertBox.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if(!response.ok) throw new Error('Failed to send message.');

            // Success
            alertBox.textContent = 'Thank you! Your message has been sent successfully.';
            alertBox.classList.add('bg-green-100', 'text-green-800');
            alertBox.classList.remove('hidden');
            document.getElementById('contact-form').reset();

          } catch(error) {
            alertBox.textContent = 'Oops! Something went wrong. Please try again.';
            alertBox.classList.add('bg-red-100', 'text-red-800');
            alertBox.classList.remove('hidden');
          } finally {
            btn.disabled = false;
            btn.innerHTML = 'Send Message';
          }
        });
      `}} />
    </PublicLayout>
  )
}
