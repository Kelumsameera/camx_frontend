'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

type Product = {
  _id: string;
  productId?: string;
  name: string;
  price?: number;
  labelPrice?: number;
  category?: string;
  description?: string;
  images?: string[];
  stock?: number;
  brand?: string;
  averageRating?: number;
  reviewCount?: number;
  label?: string;
  badge?: string;
  tag?: string;
  freeShipping?: boolean;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  // SAFE IMAGE
  const imageUrl =
    product.images?.[0] && !product.images[0].includes('example.com')
      ? product.images[0]
      : '/placeholder.jpg';

  // PRICES
  const price = Number(product.price || 0);
  const labelPrice = Number(product.labelPrice || price);

  // DISCOUNT
  const hasDiscount = labelPrice > price;
  const discount = hasDiscount ? Math.round(((labelPrice - price) / labelPrice) * 100) : 0;

  // RATING
  const rating = Number(product.averageRating || 0);
  const reviewCount = Number(product.reviewCount || 0);

  // LABEL
  const label = product.label || product.badge || product.tag;

  return (
    <Link
      href={`/products/${product.productId || product._id}`}
      className="group flex flex-col bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 max-w-sm"
    >
      {/* IMAGE (Usa h-56 sita h-44 dakwa adu kala) */}
      <div className="relative h-44 overflow-hidden bg-white">
        <Image
          src={imageUrl}
          alt={product.name || 'product'}
          fill
          sizes="400px"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        {/* CATEGORY */}
        {product.category && (
          <div className="absolute top-2 left-2 bg-cyan-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            {product.category}
          </div>
        )}

        {/* STOCK */}
        {product.stock !== undefined && (
          <div
            className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              Number(product.stock) > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
        )}

        {/* DISCOUNT */}
        {hasDiscount && (
          <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-black shadow-md">
            -{discount}%
          </div>
        )}

        {/* LABEL */}
        {label && (
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
            {label}
          </div>
        )}
      </div>

      {/* CONTENT (Padding p-6 sita p-4 dakwa adu kala) */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* BRAND (Margin mb-2 sita mb-1 dakwa adu kala) */}
          {product.brand && (
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          {/* TITLE (min-h-15 ain karala text size eka lg kala) */}
          <h2 className="text-lg font-bold text-white line-clamp-1">
            {product.name}
          </h2>

          {/* DESCRIPTION (Margin mt-3 sita mt-1 dakwa adu kala) */}
          {product.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-1">
              {product.description}
            </p>
          )}

          {/* RATING (Margin mt-4 sita mt-2 dakwa adu kala) */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={12}
                  color={i < Math.round(rating) ? '#f59e0b' : '#374151'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {reviewCount > 0 ? `${rating.toFixed(1)} (${reviewCount})` : 'No reviews'}
            </span>
          </div>
        </div>

        {/* PRICE & BUTTONS SECTION */}
        <div>
          {/* PRICE (Usa adu kala saha size eka text-2xl kala) */}
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <h3 className="text-2xl font-black text-cyan-400">
              LKR {price.toLocaleString()}
            </h3>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">
                LKR {labelPrice.toLocaleString()}
              </p>
            )}
          </div>

          {/* BUTTONS (Usa h-14 sita py-2.5/h-11 dakwa adu kala) */}
          <div className="flex items-center gap-2 mt-4">
            {/* VIEW */}
            <div className="flex-1 bg-cyan-400 text-black py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition duration-300 cursor-pointer">
              <span>View</span>
              <FiArrowRight size={14} />
            </div>

            {/* CART */}
            <button className="w-11 h-11 rounded-xl border border-gray-700 text-white hover:border-cyan-400 hover:bg-cyan-400/10 transition duration-300 text-xl flex items-center justify-center">
              +
            </button>
          </div>
        </div>
      </div>

      {/* GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
    </Link>
  );
}