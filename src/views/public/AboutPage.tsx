// src/views/public/AboutPage.tsx
import type { FC } from 'hono/jsx'
import { PublicLayout } from './PublicLayout'

interface AboutProps {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export const AboutPage: FC<AboutProps> = (props) => {
  return (
    <PublicLayout title="About Us" siteName={props.siteName} contactEmail={props.contactEmail} contactPhone={props.contactPhone} address={props.address}>
      <div class="bg-cafe-brown py-20 text-center">
        <h1 class="font-serif text-4xl font-bold text-cafe-cream">Our Story</h1>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 class="font-serif text-3xl font-bold text-cafe-dark mb-6">A Passion for Quality</h2>
        <p class="text-lg text-gray-600 leading-relaxed mb-8">
          Founded with a simple idea: to create a space where people can connect over excellent food and exceptional coffee. 
          {props.siteName} started as a small dream and has grown into the heart of the community.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="p-6 bg-white rounded-xl shadow-sm border border-cafe-brown/10">
            <h3 class="font-bold text-cafe-green mb-2">Quality</h3>
            <p class="text-sm text-gray-500">Only the finest beans and freshest ingredients.</p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow-sm border border-cafe-brown/10">
            <h3 class="font-bold text-cafe-green mb-2">Community</h3>
            <p class="text-sm text-gray-500">A welcoming space for everyone.</p>
          </div>
          <div class="p-6 bg-white rounded-xl shadow-sm border border-cafe-brown/10">
            <h3 class="font-bold text-cafe-green mb-2">Service</h3>
            <p class="text-sm text-gray-500">Friendly faces and warm hospitality.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}