'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react';

type UserSession = {
  name: string;
  email: string;
  role: string;
  image?: string;
};

type UserDataProps = {
  compact?: boolean;
};

export default function UserData({
  compact = false,
}: UserDataProps) {
  const router = useRouter();

  const [user, setUser] = useState<UserSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const syncSession = () => {
      try {
        const token = localStorage.getItem('CAMX_TOKEN');
        const storedUser = localStorage.getItem('CAMX_USER');

        if (
          token &&
          storedUser &&
          storedUser !== 'undefined' &&
          storedUser !== 'null'
        ) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Session sync parsing fault:', e);
        setUser(null);
      }
    };

    syncSession();

    window.addEventListener('storage', syncSession);

    return () => {
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('CAMX_TOKEN');
    localStorage.removeItem('CAMX_USER');

    setUser(null);
    setDropdownOpen(false);

    window.dispatchEvent(new Event('storage'));

    router.push('/login');
  };

  // SAFE IMAGE VALIDATOR
  const getSafeImage = (image?: string) => {
    if (
      image &&
      (image.startsWith('http') || image.startsWith('/'))
    ) {
      return image;
    }

    return '/default-avatar.png';
  };

  const renderLoginButton = (classes: string) => (
    <Link href="/login" className={classes}>
      <LogIn size={16} />
      <span>Sign In</span>
    </Link>
  );

  return (
    <div className="w-full">

      {/* MOBILE / COMPACT VIEW */}
      <div
        className={`w-full ${
          compact ? 'block' : 'block lg:hidden'
        }`}
      >
        {!user ? (
          renderLoginButton(
            'flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-gray-300 hover:text-secondary transition duration-200'
          )
        ) : (
          <div className="flex flex-col w-full gap-3 text-sm font-bold animate-fadeIn">

            {/* USER INFO */}
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-border/40 pb-2">

              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                <Image
                  src={getSafeImage(user.image)}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-neutral-900 dark:text-white font-bold tracking-tight line-clamp-1">
                  {user.name}
                </p>

                <p className="text-xs text-neutral-400 font-medium line-clamp-1 mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            {/* ADMIN BUTTON */}
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-2 py-2 text-neutral-700 dark:text-gray-300 hover:text-secondary transition duration-200"
              >
                <LayoutDashboard
                  size={16}
                  className="text-secondary"
                />

                <span>Admin Panel</span>
              </Link>
            )}

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2 text-red-500 hover:text-red-600 transition text-left cursor-pointer font-bold"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      {!compact && (
        <div className="hidden lg:block relative">

          {!user ? (
            renderLoginButton(
              'flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] text-sm font-bold text-neutral-700 dark:text-gray-300 hover:border-secondary hover:text-secondary transition duration-300 shadow-sm'
            )
          ) : (
            <>
              {/* USER BUTTON */}
              <button
                onClick={() =>
                  setDropdownOpen(!dropdownOpen)
                }
                className="flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-neutral-200 dark:border-gray-800 bg-neutral-50 dark:bg-[#111827] cursor-pointer hover:border-secondary transition duration-200 shadow-sm"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-neutral-200/60 dark:border-neutral-800">
                  <Image
                    src={getSafeImage(user.image)}
                    alt={user.name || 'User'}
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>

                <span className="text-sm font-bold text-neutral-800 dark:text-gray-200">
                  {user.name.split(' ')[0]}
                </span>

                <ChevronDown
                  size={14}
                  className={`text-neutral-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() =>
                      setDropdownOpen(false)
                    }
                  />

                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-neutral-200 dark:border-border bg-white dark:bg-card p-2 shadow-xl z-20 transition-all duration-200 animate-scaleIn">

                    {/* PROFILE */}
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-border/40 mb-1.5">

                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Account Profile
                      </p>

                      <p className="text-xs text-neutral-500 dark:text-gray-400 font-medium line-clamp-1 mt-1">
                        {user.email}
                      </p>
                    </div>

                    {/* ADMIN */}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() =>
                          setDropdownOpen(false)
                        }
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-background transition duration-150"
                      >
                        <LayoutDashboard
                          size={16}
                          className="text-secondary"
                        />

                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}