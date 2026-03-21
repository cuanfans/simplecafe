// src/views/public/MenuPage.tsx
import type { FC } from 'hono/jsx'
import { PublicLayout } from './PublicLayout'

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
}

interface MenuProps {
  siteName: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  products: Product[];
}

export const MenuPage: FC<MenuProps> = (props) => {
  const categorizedProducts = props.products.reduce((acc: Record<string, Product[]>, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {});

  const categories = Object.keys(categorizedProducts).sort();

  return (
    <PublicLayout title="Our Menu" siteName={props.siteName} contactEmail={props.contactEmail} contactPhone={props.contactPhone} address={props.address}>
      <div class="bg-cafe-dark py-16 text-center border-b-4 border-cafe-green">
        <h1 class="font-serif text-4xl font-bold text-cafe-cream">Our Menu</h1>
      </div>
      <div class="max-w-7xl mx-auto px-4 py-16">
        {categories.map(category => (
          <div class="mb-16">
            <h2 class="font-serif text-3xl font-bold text-cafe-dark mb-8 border-b border-cafe-green/30 pb-2">{category}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categorizedProducts[category].map(product => (
                <div class="flex justify-between items-start border-b border-cafe-brown/10 pb-4">
                  <div>
                    <h3 class="font-bold text-lg text-cafe-dark">{product.name}</h3>
                    <p class="text-sm text-gray-500">{product.description}</p>
                  </div>
                  <span class="font-bold text-cafe-green">{props.currencySymbol}{product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PublicLayout>
  )
}