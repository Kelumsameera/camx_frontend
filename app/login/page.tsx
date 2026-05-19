'use client';

import axios from 'axios';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import {
  useState,
} from 'react';

const API =
  process.env.NEXT_PUBLIC_API_BASE;

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  // =========================
  // LOGIN FUNCTION
  // =========================

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    setMessage('');

    try {

      const response =
        await axios.post(
          `${API}/users/login`,
          {
            email,
            password,
          }
        );

      console.log(response.data);

      // SAVE TOKEN
      localStorage.setItem(
        'CAMX_TOKEN',
        response.data.token
      );

      // SAVE USER IF EXISTS
      if (response.data.user) {

        localStorage.setItem(
          'CAMX_USER',
          JSON.stringify(
            response.data.user
          )
        );

        // ADMIN CHECK
        if (
          response.data.user.role ===
          'admin'
        ) {

          router.push('/admin');

          return;
        }
      }

      // NORMAL USER
      router.push('/');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      console.log(error);

      if (error.response) {

        setMessage(
          error.response.data.message
        );

      } else {

        setMessage(
          'Network error'
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        {/* LOGO */}
        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">

            <span className="text-black text-3xl font-black">
              C
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-black text-center text-white">

          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-3">

          Login to your CAMX.lk account
        </p>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="text-sm text-gray-300 mb-2 block">

              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700 text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-sm text-gray-300 mb-2 block">

              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              className="w-full h-14 px-5 rounded-2xl bg-[#050816] border border-gray-700 text-white outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* ERROR MESSAGE */}
          {message && (

            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4">

              {message}

            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-cyan-400 text-black font-bold text-lg hover:bg-cyan-300 transition disabled:opacity-50"
          >

            {loading
              ? 'Signing In...'
              : 'Login'}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 flex justify-between text-sm">

          <Link
            href="/register"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Create account
          </Link>

          <Link
            href="/forgot-password"
            className="text-gray-400 hover:text-white transition"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
}