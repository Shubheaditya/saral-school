"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Sparky from "../components/Sparky";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.ageGroup) {
        case "kids": router.push("/learn/kids"); break;
        case "scholar": router.push("/learn/scholar"); break;
        default: router.push("/learn/kids"); break;
      }
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Check if user exists in DB by phone
      const res = await fetch(`/api/user?phone=${cleaned}`);

      if (res.ok) {
        const userData = await res.json();
        if (userData && !userData.error) {
          login(cleaned);
          switch (userData.ageGroup) {
            case "kids": router.push("/learn/kids"); break;
            case "scholar": router.push("/learn/scholar"); break;
            default: router.push("/learn/kids"); break;
          }
          return;
        }
      }

      // User doesn't exist, go to onboarding
      login(cleaned);
      router.push("/learn/onboarding?phone=" + encodeURIComponent(cleaned));
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-rose-50/60 via-purple-50/30 to-white">
      <Sparky mood="waving" size="lg" message="Welcome to Saral School!" className="mb-8" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border-2 border-rose-100 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl cursor-not-allowed">
            <span className="text-4xl animate-spin">⏳</span>
          </div>
        )}

        <h1 className="text-3xl font-black text-slate-900 text-center mb-2">
          Let's Get Started
        </h1>
        <p className="text-slate-500 text-center mb-8">
          Enter your phone number to begin
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-4 bg-slate-50 rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-500">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter 10-digit number"
                className="flex-1 px-4 py-4 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300 tracking-wider"
                maxLength={10}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-rose-200 bouncy-hover disabled:opacity-50"
          >
            Continue →
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          No OTP required. Just enter your number and start learning!
        </p>
      </div>
    </main>
  );
}
