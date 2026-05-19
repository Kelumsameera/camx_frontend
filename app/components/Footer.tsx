'use client';

import Link from 'next/link';

import Image from 'next/image';

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

  const quickLinks = [
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

  const supportLinks = [
    {
      name: 'Privacy Policy',
      href: '/privacy-policy',
    },

    {
      name: 'Terms & Conditions',
      href: '/terms-and-conditions',
    },

    {
      name: 'Refund Policy',
      href: '/refund-policy',
    },

    {
      name: 'FAQ',
      href: '/faq',
    },
  ];

  return (
    <footer className="relative bg-[#050816] border-t border-cyan-400/10 overflow-hidden">

      {/* GLOW EFFECT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-125 bg-cyan-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>

            <div className="flex items-center gap-4">

              {/* LOGO */}
              <div className="flex items-center justify-center w-full h-full transition duration-300 g">
                <Image
                  src="/logo.png"
                  alt="CAMX.lk Logo"
                  width={150}
                  height={150}
                  priority
                  className="object-contain"
                />
              </div>

              {/* TEXT */}
              <div>

                <h2 className="text-2xl font-black text-white">
                  CAMX.lk
                </h2>

                <p className="text-xs tracking-[0.3em] uppercase text-cyan-400">
                  Security Solutions
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 text-gray-400 leading-relaxed">
              Smart CCTV surveillance and enterprise-grade security solutions for homes, offices, shops, and industrial environments across Sri Lanka.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-6">

              {/* FACEBOOK */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 hover:scale-110 transition duration-300"
              >
                <Facebook
                  size={18}
                  className="text-white"
                />
              </a>

              {/* INSTAGRAM */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 hover:scale-110 transition duration-300"
              >
                <Instagram
                  size={18}
                  className="text-white"
                />
              </a>

              {/* YOUTUBE */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 hover:scale-110 transition duration-300"
              >
                <Youtube
                  size={18}
                  className="text-white"
                />
              </a>

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl border border-gray-800 bg-[#111827] flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 hover:scale-110 transition duration-300"
              >
                <Linkedin
                  size={18}
                  className="text-white"
                />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4">

              {quickLinks.map((link, index) => (

                <li key={index}>

                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition duration-300"
                  >
                    {link.name}
                  </Link>

                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Support
            </h3>

            <ul className="space-y-4">

              {supportLinks.map((link, index) => (

                <li key={index}>

                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition duration-300"
                  >
                    {link.name}
                  </Link>

                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>

            <h3 className="text-xl font-bold text-white mb-6">
              Contact Us
            </h3>

            <div className="space-y-5">

              {/* ADDRESS */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#111827] border border-gray-800 flex items-center justify-center">

                  <MapPin
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div>

                  <p className="text-white font-semibold">
                    Address
                  </p>

                  <p className="text-gray-400 text-sm">
                    Colombo, Sri Lanka
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#111827] border border-gray-800 flex items-center justify-center">

                  <Phone
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div>

                  <p className="text-white font-semibold">
                    Phone
                  </p>

                  <a
                    href="tel:+94771234567"
                    className="text-gray-400 text-sm hover:text-cyan-400 transition duration-300"
                  >
                    +94 77 123 4567
                  </a>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-xl bg-[#111827] border border-gray-800 flex items-center justify-center">

                  <Mail
                    size={18}
                    className="text-cyan-400"
                  />
                </div>

                <div>

                  <p className="text-white font-semibold">
                    Email
                  </p>

                  <a
                    href="mailto:info@camx.lk"
                    className="text-gray-400 text-sm hover:text-cyan-400 transition duration-300"
                  >
                    info@camx.lk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-800 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CAMX.lk. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Powered by CAMX Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}