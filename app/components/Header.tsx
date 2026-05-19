'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

export default function Header() {
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [isScrolled, setIsScrolled] =
    useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  // Navigation links
  const navLinks = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Products',
      href: '/products',
    },
    {
      name: 'Services',
      href: '/services',
    },
    {
      name: 'About',
      href: '/about',
    },
    {
      name: 'Contact',
      href: '/contact',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050816]/90 backdrop-blur-xl border-b border-cyan-400/10 shadow-lg shadow-cyan-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-4 group"
          >
            {/* LOGO IMAGE */}
            <div className="relative w-32 h-32 transition duration-300 group-hover:scale-105">

              <Image
                src="/logo.png"
                alt="CAMX.lk Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.45)]"
              />
            </div>

            {/* LOGO TEXT */}
            <div>
              <h1 className="text-2xl font-black tracking-wide text-white">
                CAMX.lk
              </h1>

              <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase">
                SECURITY SOLUTIONS
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8">

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition duration-300 hover:text-cyan-400 ${
                  pathname === link.href
                    ? 'text-cyan-400'
                    : 'text-gray-300'
                }`}
              >
                {link.name}

                {pathname === link.href && (
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-4">

            {/* SEARCH */}
            <button className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition duration-300">

              <Search
                size={20}
                className="text-gray-300"
              />
            </button>

            {/* CART */}
            <Link
              href="/cart"
              className="relative w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition duration-300"
            >
              <ShoppingCart
                size={20}
                className="text-gray-300"
              />

              {/* CART COUNT */}
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
                0
              </span>
            </Link>

            {/* ACCOUNT */}
            <Link
              href="/login"
              className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition duration-300"
            >
              <User
                size={20}
                className="text-gray-300"
              />
            </Link>

            {/* CTA BUTTON */}
            <Link
              href="/contact"
              className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 hover:scale-105 transition duration-300 shadow-lg shadow-cyan-500/20"
            >
              Get Quote
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="lg:hidden w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center"
          >
            {mobileMenu ? (
              <X
                size={22}
                className="text-white"
              />
            ) : (
              <Menu
                size={22}
                className="text-white"
              />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="lg:hidden bg-[#050816]/95 backdrop-blur-xl border-t border-cyan-400/10">

          <div className="px-6 py-6 flex flex-col gap-5">

            {/* MOBILE LINKS */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  setMobileMenu(false)
                }
                className={`text-lg font-semibold transition ${
                  pathname === link.href
                    ? 'text-cyan-400'
                    : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* MOBILE ACTIONS */}
            <div className="flex items-center gap-3 pt-4">

              <Link
                href="/cart"
                className="flex-1 bg-[#111827] border border-gray-800 h-12 rounded-xl flex items-center justify-center hover:border-cyan-400 transition"
              >
                <ShoppingCart
                  size={20}
                  className="text-white"
                />
              </Link>

              <Link
                href="/login"
                className="flex-1 bg-[#111827] border border-gray-800 h-12 rounded-xl flex items-center justify-center hover:border-cyan-400 transition"
              >
                <User
                  size={20}
                  className="text-white"
                />
              </Link>
            </div>

            {/* MOBILE CTA */}
            <Link
              href="/contact"
              className="bg-cyan-400 text-black py-3 rounded-xl text-center font-bold hover:bg-cyan-300 transition"
            >
              Request Installation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}