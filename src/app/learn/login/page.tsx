"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Sparky from "../components/Sparky";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If Supabase automatically logs us in via Magic Link click, handle it!
  useEffect(() => {
    if (currentUser) {
      if (currentUser.ageGroup) {
         switch (currentUser.ageGroup) {
           case "kids": router.push("/learn/kids"); break;
           case "scholar": router.push("/learn/scholar"); break;
           default: router.push("/learn/kids"); break;
         }
      } else {
         router.push("/learn/onboarding");
      }
    }
  }, [currentUser, router]);

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/learn/login` : undefined
        }
      });

      if (error) throw error;
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 6 || otp.length > 8) {
      setError("Please enter a valid OTP code");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data?.session) {
        // Authenticated! Check if user row exists in Turso
        const res = await fetch(`/api/user?id=${data.session.user.id}`);
        
        if (res.ok) {
          const userData = await res.json();
          // They exist and have been loaded by AuthContext hook automatically, just redirect
          if (userData && !userData.error) {
            login(email); // For legacy local behavior trigger if needed
            switch (userData.ageGroup) {
              case "kids": router.push("/learn/kids"); break;
              case "scholar": router.push("/learn/scholar"); break;
              default: router.push("/learn/kids"); break;
            }
          } else {
            router.push("/learn/onboarding?email=" + encodeURIComponent(email));
          }
        } else {
          // If 404, go to onboarding to register profile
          router.push("/learn/onboarding?email=" + encodeURIComponent(email));
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
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
          {step === "email" ? "Let's Get Started" : "Enter OTP"}
        </h1>
        <p className="text-slate-500 text-center mb-8">
          {step === "email"
            ? "Enter your email address to begin"
            : `We sent a 6-digit code to ${email}`}
        </p>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-4 rounded-2xl border-2 border-rose-200 focus:border-rose-400 focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-rose-200 bouncy-hover"
            >
              Send Magic Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">OTP Code</label>
              <input
                type="text"
                maxLength={8}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="OTP Code"
                className="w-full px-4 py-4 rounded-2xl border-2 border-rose-200 focus:border-purple-400 focus:outline-none text-2xl font-bold text-center text-slate-900 tracking-[0.25em] placeholder:text-slate-300 placeholder:tracking-normal placeholder:text-lg"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-2xl text-lg font-bold shadow-lg shadow-purple-200 bouncy-hover"
            >
              Verify & Continue
            </button>
            <button
              onClick={() => { setStep("email"); setOtp(""); setError(""); }}
              className="w-full py-3 text-slate-500 font-bold text-sm"
            >
              Change Email Address
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
