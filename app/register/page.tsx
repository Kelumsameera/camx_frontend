'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // =========================
  // SIGN UP FUNCTION
  // =========================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API}/users/register`, {
        name,
        email,
        phone,
        password,
      });

      console.log(response.data);

      // Auto-save tokens upon successful client generation loop
      if (response.data.token) {
        localStorage.setItem('CAMX_TOKEN', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('CAMX_USER', JSON.stringify(response.data.user));
      }

      // Sync header layout counters
      window.dispatchEvent(new Event('storage'));

      // Forward to landing index view
      router.push('/');
    } catch (error) {
      console.error('Registration processing mismatch:', error);
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Failed to generate account payload.');
      } else {
        setMessage('A configuration parsing conflict occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-background flex items-center justify-center px-6 transition-colors duration-300">
      
      {/* REGISTRATION CARD FRAME CONTAINER */}
      <div className="w-full max-w-md bg-white dark:bg-card border border-neutral-200 dark:border-border rounded-3xl p-8 shadow-2xl transition-colors duration-300">

        {/* LOGO FRAME CONTEXT */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
            <span className="text-white text-3xl font-black">
              C
            </span>
          </div>
        </div>

        {/* TYPOGRAPHY TITLES */}
        <h1 className="text-4xl font-black text-center text-neutral-900 dark:text-white transition-colors">
          Create Account
        </h1>
        <p className="text-neutral-500 dark:text-gray-400 text-center mt-3 text-sm">
          Join CAMX.lk for reliable security systems across Sri Lanka.
        </p>

        {/* ACCOUNT GENERATION FORM SHELL */}
        <form onSubmit={handleRegister} className="mt-8 space-y-4">

          {/* NAME FIELD INPUT */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 mb-2 block">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Sameera Perera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition text-sm"
            />
          </div>

          {/* EMAIL FIELD INPUT */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 mb-2 block">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition text-sm"
            />
          </div>

          {/* PHONE FIELD INPUT */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 mb-2 block">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g. 0771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition text-sm"
            />
          </div>

          {/* PASSWORD FIELD INPUT */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-gray-300 mb-2 block">
              Secure Password *
            </label>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl bg-neutral-50 dark:bg-background border border-neutral-200 dark:border-border text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-gray-500 outline-none focus:border-secondary transition text-sm"
            />
          </div>

          {/* DYNAMIC BACKEND RESPONSE LABELS */}
          {message && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs rounded-xl p-3 font-semibold leading-relaxed">
              {message}
            </div>
          )}

          {/* ACTION REGISTER TRANS-TRIGGER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-secondary text-white font-bold text-sm hover:bg-opacity-90 transition disabled:opacity-50 cursor-pointer shadow-md shadow-secondary/10 mt-2"
          >
            {loading ? 'Processing Registration Logs...' : 'Create Account'}
          </button>
        </form>

        {/* BOTTOM TRAFFIC NAVIGATION HOOK */}
        <div className="mt-6 text-center text-sm font-medium text-neutral-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-secondary font-bold hover:underline transition ml-1"
          >
            Sign In
          </Link>
        </div>

      </div>
    </main>
  );
}
