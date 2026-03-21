// src/views/public/HomePage.tsx

import type { FC } from 'hono/jsx'
import { PublicLayout } from './PublicLayout'

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}

interface HomeProps {
  siteName: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  popularProducts: Product[];
}

export const HomePage: FC<HomeProps> = (props) => {
  return (
    <PublicLayout 
      title="Welcome" 
      siteName={props.siteName}
      contactEmail={props.contactEmail}
      contactPhone={props.contactPhone}
      address={props.address}
    >
      
      {/* HERO SECTION */}
      <section class="relative bg-cafe-brown text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div class="absolute inset-0 opacity-10">
            <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle fill="currentColor" cx="2" cy="2" r="2"></circle></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"></rect></svg>
        </div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-24 md:py-32 flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 text-center md:text-left z-10">
                <span class="inline-block py-1 px-3 rounded-full bg-cafe-green/20 text-cafe-green border border-cafe-green/30 text-sm font-bold tracking-wider uppercase mb-6">
                    Freshly Brewed Every Day
                </span>
                <h1 class="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-cafe-cream">
                    Experience the perfect blend of <span class="text-cafe-green">taste & comfort</span>.
                </h1>
                <p class="text-lg md:text-xl text-cafe-light mb-10 max-w-lg mx-auto md:mx-0">
                    Your local neighborhood destination for premium coffee, hearty breakfasts, and sweet treats.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <a href="/menu" class="bg-cafe-green hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center">
                        Explore Menu
                    </a>
                    <a href="/about" class="bg-transparent border-2 border-cafe-light/30 hover:border-cafe-cream text-cafe-cream hover:bg-cafe-light/10 px-8 py-4 rounded-full font-bold text-lg transition-all text-center">
                        Our Story
                    </a>
                </div>
            </div>
            
            {/* Right side Illustration / Image Placeholder */}
            <div class="md:w-1/2 mt-16 md:mt-0 relative hidden md:block">
                <div class="w-[400px] h-[400px] mx-auto bg-cafe-light/10 rounded-full flex items-center justify-center border-4 border-dashed border-cafe-green/30 relative">
                    {/* Floating elements */}
                    <div class="absolute -top-6 -left-6 w-24 h-24 bg-cafe-green rounded-full opacity-20 animate-pulse"></div>
                    <div class="absolute -bottom-10 right-10 w-32 h-32 bg-amber-500 rounded-full opacity-20"></div>
                    
                    <svg class="w-48 h-48 text-cafe-cream opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span class="absolute font-serif text-cafe-cream opacity-80 text-xl font-bold">Image Placeholder</span>
                </div>
            </div>
        </div>
      </section>

      {/* HIGHLIGHTS / MENU SNIPPET */}
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-cafe-dark mb-4">Popular Favorites</h2>
                <div class="w-24 h-1 bg-cafe-green mx-auto rounded-full"></div>
                <p class="mt-6 text-gray-500 max-w-2xl mx-auto">Discover the food and drinks our customers love the most. Prepared fresh upon order.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                {props.popularProducts.length > 0 ? (
                    props.popularProducts.map(product => (
                        <div class="bg-cafe-cream/30 rounded-2xl overflow-hidden shadow-sm border border-cafe-brown/5 hover:shadow-xl hover:border-cafe-green/30 transition-all duration-300 group">
                            <div class="h-48 bg-gray-200 relative overflow-hidden">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.name} class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div class="w-full h-full flex items-center justify-center bg-cafe-light/20 text-cafe-brown/40">
                                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                )}
                                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-cafe-green shadow-sm">
                                    {props.currencySymbol}{product.price.toFixed(2)}
                                </div>
                            </div>
                            <div class="p-6">
                                <h3 class="text-xl font-bold text-cafe-dark mb-2">{product.name}</h3>
                                <p class="text-gray-600 text-sm line-clamp-2">{product.description || 'Delicious freshly made item from our kitchen.'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div class="col-span-3 text-center py-12 text-gray-400 italic">
                        Menu items are currently being updated. Please check back later.
                    </div>
                )}
            </div>
            
            <div class="text-center mt-12">
                <a href="/menu" class="inline-flex items-center gap-2 text-cafe-green font-bold hover:text-cafe-brown transition-colors">
                    View Full Menu
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
            </div>
        </div>
      </section>

      {/* QUICK INFO BANNER */}
      <section class="bg-cafe-brown text-cafe-cream py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-cafe-light/20">
            <div class="p-4">
                <div class="w-12 h-12 mx-auto bg-cafe-green/20 rounded-full flex items-center justify-center text-cafe-green mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="font-bold text-white mb-2 uppercase tracking-wide">Opening Hours</h3>
                <p class="text-sm text-cafe-light">Mon-Fri: 7:00 AM - 8:00 PM<br/>Sat-Sun: 8:00 AM - 9:00 PM</p>
            </div>
            <div class="p-4 pt-8 md:pt-4">
                <div class="w-12 h-12 mx-auto bg-cafe-green/20 rounded-full flex items-center justify-center text-cafe-green mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 class="font-bold text-white mb-2 uppercase tracking-wide">Location</h3>
                <p class="text-sm text-cafe-light px-4">{props.address}</p>
            </div>
            <div class="p-4 pt-8 md:pt-4">
                <div class="w-12 h-12 mx-auto bg-cafe-green/20 rounded-full flex items-center justify-center text-cafe-green mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h3 class="font-bold text-white mb-2 uppercase tracking-wide">Contact</h3>
                <p class="text-sm text-cafe-light">{props.contactPhone}<br/>{props.contactEmail}</p>
            </div>
        </div>
      </section>

    </PublicLayout>
  )
}
