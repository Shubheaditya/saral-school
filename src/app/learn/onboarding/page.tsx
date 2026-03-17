"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { AVATARS, getAgeGroup } from "../types";
import Sparky from "../components/Sparky";

function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { createUser } = useAuth();

  const phone = params.get("phone") || "";
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [parentPin, setParentPin] = useState("1234");
  const [error, setError] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (step === 2 && !birthdate) {
      setError("Please select your birthdate");
      return;
    }
    setError("");
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const user = createUser({ name, phone, email: email || undefined, birthdate, avatarIndex, parentPin });
      switch (user.ageGroup) {
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
    }
  };

  const ageGroup = birthdate ? getAgeGroup(birthdate) : null;
  const ageGroupLabels = { kids: "Little Learner (3-5)", explorer: "Explorer (6-9)", scholar: "Scholar (10-12)" };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-indigo-50 to-white">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-500">Step {step} of {totalSteps}</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2.5 bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Sparky
        mood={step === 4 ? "celebrating" : "happy"}
        size="md"
        message={
          step === 1 ? "What's your name?" :
          step === 2 ? "When were you born?" :
          step === 3 ? "Pick your avatar!" :
          "You're all set!"
        }
        className="mb-6"
      />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-100">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">What's your name?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none text-lg font-medium text-slate-900 placeholder:text-slate-300"
              autoFocus
            />
            <div>
              <label className="text-sm font-bold text-slate-500 block mb-2">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@email.com"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-400 focus:outline-none text-sm text-slate-700 placeholder:text-slate-300"
              />
              <p className="text-xs text-slate-400 mt-1">Used for sending progress reports to parents</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">When were you born?</h2>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min="2010-01-01"
              className="w-full px-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none text-lg font-medium text-slate-900"
            />
            {ageGroup && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <p className="text-emerald-700 text-sm font-bold text-center">
                  You'll be a {ageGroupLabels[ageGroup]}! 🎉
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Pick your avatar!</h2>
            <div className="grid grid-cols-4 gap-3">
              {AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatarIndex(idx)}
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all ${
                    avatarIndex === idx
                      ? "bg-indigo-100 border-4 border-indigo-400 scale-110 shadow-lg"
                      : "bg-slate-50 border-2 border-slate-100 hover:border-indigo-200"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Set Parent PIN</h2>
            <p className="text-slate-500 text-sm">This PIN protects the parent dashboard. You can change it later.</p>
            <input
              type="text"
              maxLength={4}
              value={parentPin}
              onChange={(e) => setParentPin(e.target.value.replace(/\D/g, ""))}
              placeholder="4-digit PIN"
              className="w-full px-4 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none text-2xl font-bold text-center text-slate-900 tracking-[0.5em]"
            />
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <p className="text-sm text-slate-700 font-medium text-center">
                <span className="text-3xl block mb-2">{AVATARS[avatarIndex]}</span>
                <strong>{name}</strong> will be a <strong>{ageGroup ? ageGroupLabels[ageGroup] : ""}</strong>
              </p>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm font-bold mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl text-lg font-bold bouncy-hover"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 bouncy-hover"
          >
            {step === totalSteps ? "Start Learning! 🚀" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-6xl animate-float">🦉</span>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
