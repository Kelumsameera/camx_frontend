'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // 1. usePathname import කරන්න

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname(); // 2. pathname කියවා ගන්න

  // 💡 3. මෙම ආරක්ෂිත පේළිය ඇතුළත් කරන්න (Admin පිටු වලදී Footer එක සැඟවීමට):
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="relative bg-white dark:bg-[#050816] border-t border-neutral-200 dark:border-border/30 overflow-hidden transition-colors duration-300">

      {/* GLOW EFFECT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-secondary/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-4">
              {/* LOGO FRAME */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center transition duration-300">
                <Image
                  src="/logo.png"
                  alt="CAMX.lk Logo"
                  width={80}
                  height={80}
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                  className="object-contain"
                />
              </div>
              {/* TEXT */}
              <div>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                  CAMX.lk
                </h2>
                <p className="text-xs tracking-[0.3em] uppercase text-secondary">
                  Security Solutions
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 text-neutral-600 dark:text-gray-400 leading-relaxed">
              Smart CCTV surveillance and enterprise-grade security solutions for homes, offices, shops, and industrial environments across Sri Lanka.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] flex items-center justify-center hover:border-secondary hover:bg-secondary/10 hover:scale-110 transition duration-300">
                <Facebook size={18} className="text-neutral-700 dark:text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] flex items-center justify-center hover:border-secondary hover:bg-secondary/10 hover:scale-110 transition duration-300">
                <Instagram size={18} className="text-neutral-700 dark:text-white" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] flex items-center justify-center hover:border-secondary hover:bg-secondary/10 hover:scale-110 transition duration-300">
                <Youtube size={18} className="text-neutral-700 dark:text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] flex items-center justify-center hover:border-secondary hover:bg-secondary/10 hover:scale-110 transition duration-300">
                <Linkedin size={18} className="text-neutral-700 dark:text-white" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-neutral-600 dark:text-gray-400 hover:text-secondary transition duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-neutral-600 dark:text-gray-400 hover:text-secondary transition duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              Contact Us
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-neutral-50 dark:bg-[#111827] border border-neutral-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-secondary" />
                </div>
                <div>
                  <p className="text-neutral-900 dark:text-white font-semibold">Address</p>
                  <p className="text-neutral-600 dark:text-gray-400 text-sm">Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-neutral-50 dark:bg-[#111827] border border-neutral-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-secondary" />
                </div>
                <div>
                  <p className="text-neutral-900 dark:text-white font-semibold">Phone</p>
                  <a href="tel:+94771234567" className="text-neutral-600 dark:text-gray-400 text-sm hover:text-secondary transition duration-300">
                    +94 77 123 4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-neutral-50 dark:bg-[#111827] border border-neutral-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-secondary" />
                </div>
                <div>
                  <p className="text-neutral-900 dark:text-white font-semibold">Email</p>
                  <a href="mailto:info@camx.lk" className="text-neutral-600 dark:text-gray-400 text-sm hover:text-secondary transition duration-300">
                    info@camx.lk
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
