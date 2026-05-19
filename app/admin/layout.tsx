'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Boxes, 
  ShoppingCart, 
  Users, 
  Menu, 
  X, 
  LogOut, 
  BoxSelectIcon
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle'; // ThemeToggle එක Admin එකටත් සම්බන්ධ කිරීම
import UserData from '../components/userData';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Product', href: '/admin/productAdd', icon: <PackagePlus size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <Boxes size={20} /> },
    { name: 'Inventory', href: '/products', icon: <BoxSelectIcon size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', href: '/admin/customers', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background text-neutral-900 dark:text-white flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* 1. ADMIN MOBILE TOP NAVIGATION BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white dark:bg-card border-b border-border flex items-center justify-between px-6 z-50">
        <span className="font-black tracking-wider text-secondary">CAMX ADMIN</span>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 border border-border rounded-xl bg-neutral-50 dark:bg-background cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 2. ADMIN MAIN SIDEBAR PANEL (Fixed layout overlaps bug) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-card border-r border-border p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen pt-20 lg:pt-8 shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black tracking-wider text-neutral-900 dark:text-white">
              CAMX.<span className="text-secondary">lk</span>
            </h2>
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mt-1">Management Hub</p>
          </div>

          {/* MENU LINKS MATRIX */}
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition duration-200 ${
                    isActive 
                      ? 'bg-secondary text-white shadow-md shadow-secondary/20' 
                      : 'text-neutral-600 dark:text-gray-400 hover:bg-neutral-50 dark:hover:bg-background hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER METRICS */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          {/* Native Layout Utilities row */}
          <div className="flex items-center justify-between px-2">
            <UserData compact />
            <ThemeToggle />
          </div>
          <Link 
            href="/" 
            className="flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition duration-200"
          >
            <LogOut size={18} />
            <span>Exit Panel</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE TRANSPARENT BACKDROP CLICK DRAWER */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* 3. MAIN WORKSPACE DISPLAY AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto h-screen pt-16 lg:pt-0">
        {children}
      </div>

    </div>
  );
}
