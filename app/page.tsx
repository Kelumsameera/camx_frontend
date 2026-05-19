'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ProductCard from '@/app/components/ProductCard';

const API =
  process.env.NEXT_PUBLIC_API_BASE;

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

export default function HomePage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD PRODUCTS FROM BACKEND
  useEffect(() => {

    async function fetchProducts() {

      try {

        const response =
          await axios.get(
            `${API}/products`
          );

        console.log(
          'Products:',
          response.data
        );

        setProducts(response.data);

      } catch (error) {

        console.log(
          'Product fetch error:',
          error
        );

      } finally {

        setLoading(false);
      }
    }

    fetchProducts();

  }, []);

  return (
    <main className="min-h-screen bg-[#050816] text-white">

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">

        <Image
          src="/hero-cctv.jpg"
          alt="CAMX CCTV"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center px-6">

          <h1 className="text-5xl lg:text-7xl font-black">

            Smart CCTV

            <span className="text-cyan-400">
              {' '}Security
            </span>

          </h1>

          <p className="mt-6 text-xl text-gray-300">
            Professional surveillance solutions
            for homes and businesses.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <Link
              href="/products"
              className="bg-cyan-400 text-black px-8 py-4 rounded-full font-bold hover:bg-cyan-300 transition"
            >
              Browse Products
            </Link>

            <Link
              href="/contact"
              className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-12">

            <h2 className="text-4xl font-bold">
              Featured Products
            </h2>

            <Link
              href="/products"
              className="text-cyan-400 hover:text-cyan-300"
            >
              View All
            </Link>
          </div>

          {/* LOADING */}
          {loading ? (

            <div className="text-center text-gray-400 py-20">

              Loading products...

            </div>

          ) : products.length === 0 ? (

            <div className="text-center text-gray-500 py-20">

              No products found.

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {products
                .slice(0, 8)
                .map((product, index) => (

                <ProductCard
                  key={
                    product._id ||
                    product.productId ||
                    index
                  }
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 bg-[#0B1120]">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-14">
            Our Services
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              'CCTV Installation',
              'Remote Monitoring',
              'Access Control',
            ].map((service, index) => (

              <div
                key={index}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-8"
              >

                <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                  {service}
                </h3>

                <p className="text-gray-400">
                  Enterprise-grade security
                  solutions tailored for modern
                  businesses and homes.
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}