'use client';

import Link from 'next/link';

import {
  Boxes,
  PackagePlus,
  ShoppingCart,
  Users,
} from 'lucide-react';

export default function AdminPage() {

  const cards = [
    {
      title: 'Add Product',
      description:
        'Create and manage CCTV products.',
      href: '/admin/productAdd',
      icon: <PackagePlus size={40} />,
    },

    {
      title: 'Products',
      description:
        'Manage all products and inventory.',
      href: '/products',
      icon: <Boxes size={40} />,
    },

    {
      title: 'Orders',
      description:
        'Track customer orders and payments.',
      href: '/admin/orders',
      icon: <ShoppingCart size={40} />,
    },

    {
      title: 'Customers',
      description:
        'Manage registered customer accounts.',
      href: '/admin/customers',
      icon: <Users size={40} />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white pt-32 pb-20 px-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-14">

          <h1 className="text-5xl font-black">

            Admin

            <span className="text-cyan-400">
              {' '}Dashboard
            </span>

          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Manage products, orders, and customers.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map((card, index) => (

            <Link
              key={index}
              href={card.href}
              className="bg-[#111827] border border-gray-800 rounded-3xl p-8 hover:border-cyan-400 hover:-translate-y-1 transition duration-300"
            >

              <div className="text-cyan-400 mb-6">
                {card.icon}
              </div>

              <h2 className="text-2xl font-bold mb-3">
                {card.title}
              </h2>

              <p className="text-gray-400 leading-relaxed">
                {card.description}
              </p>

            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}