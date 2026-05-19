'use client';

import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const API = process.env.NEXT_PUBLIC_API_BASE;

type JWTPayload = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  image?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Helper method to resolve token session variables and sync root navbar states
  const decodeAndSaveUser = (token: string, fallbackRole: string) => {
    localStorage.setItem("CAMX_TOKEN", token);
    try {
      const decoded = jwt.decode(token) as JWTPayload | null;
      if (decoded) {
        localStorage.setItem("CAMX_USER", JSON.stringify({
          name: `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim() || decoded.email,
          email: decoded.email,
          role: decoded.role || fallbackRole,
          image: decoded.image
        }));
      }
    } catch (e) {
      console.error("Token structure processing exception:", e);
      localStorage.setItem("CAMX_USER", JSON.stringify({ role: fallbackRole, email }));
    }
    // Fires storage update trigger event to calculate real-time cart counts globally
    window.dispatchEvent(new Event('storage'));
  };

  // =========================
  // GOOGLE AUTH INTEGRATION
  // =========================
  const googleLogin = useGoogleLogin({
    onSuccess: (response: TokenResponse) => { 
      setIsLoading(true);
      axios.post(`${API}/users/google-login`, {
        token: response.access_token,
      })
      .then((res) => {
        const userRole = res.data.role || "user";
        decodeAndSaveUser(res.data.token, userRole);
        
        toast.success("Login successful!");
        if (userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Google Auth handshaking exception:", err);
        toast.error("Google Login Failed");
      })
      .finally(() => {
        setIsLoading(false);
      });
    },
    onError: () => { toast.error("Google Login Failed"); },
    onNonOAuthError: () => { toast.error("Google Login Failed"); },
  });

  // =========================
  // STANDARD CREDENTIAL LOGIN
  // =========================
  async function login() {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/users/login`, {
        email: email,
        password: password,
      });

      const userRole = res.data.role || "user";
      decodeAndSaveUser(res.data.token, userRole);

      toast.success("Login successful! Welcome back.");
      
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error("Login failed! Please check your credentials and try again.");
      console.error("Standard identity validation failure context:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[url('/hero-cctv.jpg')] bg-center bg-cover bg-no-repeat flex flex-col lg:flex-row relative">
      {/* Background Dimming tint frame layer overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-0 transition-colors duration-300" />

      {/* Left Side Column - Corporate Branding Label */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full flex justify-center items-center flex-col p-8 lg:p-12 z-10 pt-28 lg:pt-12">
        <div className="relative w-32 h-32 lg:w-48 lg:h-48 mb-4 lg:mb-5">
          <Image
            src="/logo.png"
            alt="CAMX.lk Logo"
            width={192}
            height={192}
            priority
            className="object-contain drop-shadow-[0_0_20px_rgba(19,42,251,0.3)]"
          />
        </div>
        <h1 className="text-3xl lg:text-5xl text-white text-center font-black mb-3 tracking-tight">
          Smart CCTV <span className="text-secondary">Security</span>
        </h1>
        <p className="text-base lg:text-xl text-gray-200 text-center max-w-md font-medium leading-relaxed">
          Professional surveillance and enterprise security systems across Sri Lanka.
        </p>
      </div>

      {/* Right Side Column - Interactive Form Panel Sheet */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full flex justify-center items-center p-4 lg:p-8 z-10 pb-16 lg:pb-8">
        <div className="w-full max-w-md backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col justify-center items-center p-6 lg:p-10 bg-white/10 dark:bg-black/30 border border-white/10">
          <h1 className="text-3xl lg:text-4xl font-black mb-8 text-white tracking-tight">
            Login
          </h1>
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            type="email"
            placeholder="Your email"
            value={email}
            className="w-full h-12 lg:h-14 mb-4 rounded-2xl border border-white/20 bg-black/20 p-4 text-base text-white placeholder-gray-300 outline-none focus:border-secondary transition-all"
          />
          
          <input
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            type="password"
            placeholder="Your password"
            value={password}
            className="w-full h-12 lg:h-14 mb-3 rounded-2xl border border-white/20 bg-black/20 p-4 text-base text-white placeholder-gray-300 outline-none focus:border-secondary transition-all"
          />
          
          <div className="w-full mb-6 text-right">
            <Link href="/forgot-password" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* CREDENTIAL LOG IN INTERACTION SUBMIT BUTTON */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full h-12 lg:h-14 mb-4 bg-secondary text-white font-bold text-base lg:text-lg rounded-2xl border border-secondary hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
          >
            Login
          </button>
          
          {/* SECURE GOOGLE ACTION INTERACTIVE POPUP BUTTON */}
          <button 
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full h-12 lg:h-14 mb-6 bg-white text-neutral-900 font-bold text-sm lg:text-base rounded-2xl border border-white hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            <GrGoogle className="text-lg text-red-500" />
            <span>Login with Google</span>
          </button>
          
          <p className="text-gray-200 text-sm font-medium text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-secondary dark:text-cyan-400 font-bold hover:underline transition-colors ml-1">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* FULL-PAGE LOADING BACKDROP SPINNER SHEET OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
