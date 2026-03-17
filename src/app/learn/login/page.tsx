"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Sparky from "../components/Sparky";

export default function LoginPage() {
  const router = useRouter();
  const { login, users } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handlePhoneSubmit = () => {
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleOtpSubmit = () => {
    if (otp !== "1234") {
      setError("Invalid OTP. Hint: Use 1234");
      return;
    }
    setError("");
    login(phone);

    // Check if user exists
    const existingUser = users.find((u) => u.phone === phone);
    if (existingUser) {
      switch (existingUser.ageGroup) {
        case "kids":
          router.push("/learn/kids");
          break;
        case "explorer":
          router.push("/learn/explorer");
          break;
        case "scholar":
          router.push("/learn/scholar");
          break;
      }
    } else {
      router.push("/learn/onboarding?phone=" + phone);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-indigo-50 to-white">
      <Sparky mood="waving" size="lg" message="Welcome to Saral School!" className="mb-8" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-100">
        <h1 className="text-3xl font-black text-slate-900 text-center mb-2">
          {step === "phone" ? "Let's Get Started" : "Enter OTP"}
        </h1>
        <p className="text-slate-500 text-center mb-8">
          {step === "phone"
            ? "Enter your phone number to begin"
            : `We sent a code to ${phone}`}
        </p>

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">Phone Number</label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit number"
                className="w-full px-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              onClick={handlePhoneSubmit}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 bouncy-hover"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-2">OTP Code</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 4-digit OTP"
                className="w-full px-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none text-2xl font-bold text-center text-slate-900 tracking-[0.5em] placeholder:text-slate-300 placeholder:tracking-normal placeholder:text-lg"
              />
            </div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <p className="text-amber-700 text-sm font-medium text-center">
                Demo Mode: Use OTP <strong>1234</strong>
              </p>
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button
              onClick={handleOtpSubmit}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-200 bouncy-hover"
            >
              Verify & Continue
            </button>
            <button
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              className="w-full py-3 text-slate-500 font-bold text-sm"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
