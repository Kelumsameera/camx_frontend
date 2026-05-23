'use client';

import {
  useGoogleLogin,
  TokenResponse,
} from '@react-oauth/google';

import axios from 'axios';

import {
  useState,
} from 'react';

import toast from 'react-hot-toast';

import {
  GrGoogle,
} from 'react-icons/gr';

import Link from 'next/link';

import Image from 'next/image';

import {
  useRouter,
} from 'next/navigation';

import jwt from 'jsonwebtoken';

// ======================================
// API
// ======================================

const API =
  process.env
    .NEXT_PUBLIC_API_BASE;

// ======================================
// TYPES
// ======================================

type JWTPayload = {
  email: string;

  firstName: string;

  lastName: string;

  role: string;

  image?: string;
};

// ======================================
// COMPONENT
// ======================================

export default function LoginPage() {

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const router = useRouter();

  // ======================================
  // SAVE USER
  // ======================================

  const decodeAndSaveUser = (
    token: string,
    fallbackRole: string
  ) => {

    localStorage.setItem(
      'CAMX_TOKEN',
      token
    );

    try {

      const decoded =
        jwt.decode(
          token
        ) as JWTPayload | null;

      if (decoded) {

        localStorage.setItem(
          'CAMX_USER',
          JSON.stringify({
            name:
              `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim() ||
              decoded.email,

            email:
              decoded.email,

            role:
              decoded.role ||
              fallbackRole,

            image:
              decoded.image,
          })
        );
      }

    } catch (e) {

      console.error(
        'JWT decode error:',
        e
      );

      localStorage.setItem(
        'CAMX_USER',
        JSON.stringify({
          role:
            fallbackRole,

          email,
        })
      );
    }

    window.dispatchEvent(
      new Event('storage')
    );
  };

  // ======================================
  // GOOGLE LOGIN
  // ======================================

  const googleLogin =
    useGoogleLogin({

      onSuccess: async (
        response: TokenResponse
      ) => {

        try {

          setIsLoading(true);

          const res =
            await axios.post(
              `${API}/api/users/google-login`,
              {
                token:
                  response.access_token,
              }
            );

          const userRole =
            res.data.role ||
            'user';

          decodeAndSaveUser(
            res.data.token,
            userRole
          );

          toast.success(
            'Login successful!'
          );

          if (
            userRole ===
            'admin'
          ) {

            router.push(
              '/admin'
            );

          } else {

            router.push('/');
          }

        } catch (err) {

          console.error(
            'Google Auth error:',
            err
          );

          toast.error(
            'Google Login Failed'
          );

        } finally {

          setIsLoading(false);
        }
      },

      onError: () => {

        toast.error(
          'Google Login Failed'
        );
      },

      onNonOAuthError: () => {

        toast.error(
          'Google Login Failed'
        );
      },
    });

  // ======================================
  // STANDARD LOGIN
  // ======================================

  async function login() {

    if (
      !email ||
      !password
    ) {

      toast.error(
        'Please fill in all fields'
      );

      return;
    }

    try {

      setIsLoading(true);

      const res =
        await axios.post(
          `${API}/api/users/login`,
          {
            email,
            password,
          }
        );

      const userRole =
        res.data.role ||
        'user';

      decodeAndSaveUser(
        res.data.token,
        userRole
      );

      toast.success(
        'Login successful!'
      );

      if (
        userRole ===
        'admin'
      ) {

        router.push(
          '/admin'
        );

      } else {

        router.push('/');
      }

    } catch (err) {

      console.error(
        'Login error:',
        err
      );

      toast.error(
        'Login failed!'
      );

    } finally {

      setIsLoading(false);
    }
  }

  // ======================================
  // ENTER KEY
  // ======================================

  const handleKeyPress = (
    e: React.KeyboardEvent
  ) => {

    if (
      e.key === 'Enter'
    ) {
      login();
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <div className="w-full min-h-screen bg-[url('/hero-cctv.jpg')] bg-center bg-cover bg-no-repeat flex flex-col lg:flex-row relative">

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex justify-center items-center flex-col p-8 z-10 pt-28 lg:pt-12">

        <div className="relative w-32 h-32 lg:w-48 lg:h-48 mb-5">

          <Image
            src="/logo.png"
            alt="CAMX Logo"
            fill
            priority
            sizes="(max-width: 768px) 128px, 192px"
            className="object-contain"
            quality={75}
          />
        </div>

        <h1 className="text-3xl lg:text-5xl text-white text-center font-black mb-3">

          Smart CCTV{' '}

          <span className="text-secondary">
            Security
          </span>
        </h1>

        <p className="text-base lg:text-xl text-gray-200 text-center max-w-md font-medium leading-relaxed">

          Professional surveillance and enterprise security systems across Sri Lanka.
        </p>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8 z-10 pb-16 lg:pb-8">

        <div className="w-full max-w-md backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col justify-center items-center p-6 lg:p-10 bg-white/10 border border-white/10">

          <h1 className="text-3xl lg:text-4xl font-black mb-8 text-white">
            Login
          </h1>

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyPress
            }
            placeholder="Your email"
            className="w-full h-12 lg:h-14 mb-4 rounded-2xl border border-white/20 bg-black/20 p-4 text-white placeholder-gray-300 outline-none focus:border-secondary"
          />

          {/* PASSWORD */}
          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyPress
            }
            placeholder="Your password"
            className="w-full h-12 lg:h-14 mb-3 rounded-2xl border border-white/20 bg-black/20 p-4 text-white placeholder-gray-300 outline-none focus:border-secondary"
          />

          {/* FORGOT */}
          <div className="w-full mb-6 text-right">

            <Link
              href="/forgot-password"
              className="text-gray-300 hover:text-white text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full h-12 lg:h-14 mb-4 bg-secondary text-white font-bold text-base lg:text-lg rounded-2xl hover:bg-secondary/90 transition disabled:opacity-50"
          >
            Login
          </button>

          {/* GOOGLE */}
          <button
            onClick={() =>
              googleLogin()
            }
            disabled={isLoading}
            className="w-full h-12 lg:h-14 mb-6 bg-white text-neutral-900 font-bold rounded-2xl hover:bg-neutral-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >

            <GrGoogle className="text-red-500 text-lg" />

            Login with Google
          </button>

          {/* REGISTER */}
          <p className="text-gray-200 text-sm text-center">

            Don&apos;t have an account?

            <Link
              href="/register"
              className="text-secondary font-bold hover:underline ml-1"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* LOADER */}
      {isLoading && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

          <div className="w-14 h-14 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}