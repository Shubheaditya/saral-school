"use client";

import { useState, useEffect } from "react";

type SparkyMood = "happy" | "thinking" | "celebrating" | "encouraging" | "waving" | "idle";

interface SparkyProps {
  mood?: SparkyMood;
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  className?: string;
}

const MOOD_EMOJIS: Record<SparkyMood, string> = {
  happy: "🦉",
  thinking: "🦉",
  celebrating: "🦉",
  encouraging: "🦉",
  waving: "🦉",
  idle: "🦉",
};

const MOOD_ACCESSORIES: Record<SparkyMood, string> = {
  happy: "✨",
  thinking: "💭",
  celebrating: "🎉",
  encouraging: "💪",
  waving: "👋",
  idle: "🎓",
};

const SIZE_CLASSES = {
  sm: "w-14 h-14 text-3xl",
  md: "w-20 h-20 text-5xl",
  lg: "w-28 h-28 text-6xl",
  xl: "w-36 h-36 text-7xl",
};

const ACCESSORY_SIZE = {
  sm: "text-lg -top-1 -right-1",
  md: "text-xl -top-2 -right-1",
  lg: "text-2xl -top-2 -right-1",
  xl: "text-3xl -top-2 -right-1",
};

export default function Sparky({ mood = "idle", size = "md", message, className = "" }: SparkyProps) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    if (mood === "celebrating") {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  const bgColors: Record<SparkyMood, string> = {
    happy: "bg-rose-100",
    thinking: "bg-amber-100",
    celebrating: "bg-emerald-100",
    encouraging: "bg-pink-100",
    waving: "bg-rose-100",
    idle: "bg-rose-100",
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <div
          className={`${SIZE_CLASSES[size]} ${bgColors[mood]} rounded-full flex items-center justify-center shadow-lg animate-float ${
            bounce ? "animate-bounce" : ""
          }`}
        >
          <span>{MOOD_EMOJIS[mood]}</span>
        </div>
        <div className={`absolute ${ACCESSORY_SIZE[size]} ${mood === "idle" ? "rotate-12" : ""}`}>
          {MOOD_ACCESSORIES[mood]}
        </div>
      </div>
      {message && (
        <div className="bg-white rounded-2xl px-4 py-2 shadow-md border-2 border-rose-100 max-w-xs text-center">
          <p className="text-sm text-slate-600 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}
