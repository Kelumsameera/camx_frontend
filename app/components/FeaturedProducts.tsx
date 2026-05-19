'use client';

import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';

type Product = {
  _id: string;
  productId?: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  stock?: number;
  brand?: string;
};

type FeaturedProductsProps = {
  products: Product[];
  loading: boolean;
};

export default function FeaturedProducts({ products, loading }: FeaturedProductsProps) {
  return (
    <section className="py-24 px-6 bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white">
              Featured Products
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-gray-400">
              Premium CCTV & surveillance solutions
            </p>
          </div>

          <Link href="/products" className="text-secondary font-bold hover:underline">
            View All →
          </Link>
        </div>

        {/* LOADING & DATA RENDER STATES */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-neutral-500 dark:text-gray-500 py-20">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product._id || product.productId || index}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
