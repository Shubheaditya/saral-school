"use client";

import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { AVATARS } from "../types";
import Link from "next/link";

export default function TopProfileBar() {
  const { currentUser } = useAuth();
  const { points, gems } = useGamification();

  if (!currentUser) return null;
  
  const getTheme = () => {
    switch (currentUser.ageGroup) {
      case "kids":
          return { bg: "bg-white", border: "border-rose-100", shadow: "shadow-[0_4px_0_#f3e8ee]", textName: "text-slate-900", iconBg: "bg-rose-100 text-rose-500", textPoints: "text-amber-500", textGems: "text-purple-500" };
      case "scholar":
      default:
         return { 
           bg: "bg-white/90 backdrop-blur-md", 
           border: "border-rose-200", 
           shadow: "shadow-sm", 
           textName: "text-slate-900", 
           iconBg: "bg-rose-50 text-rose-600",
           textPoints: "text-amber-600",
           textGems: "text-purple-600"
         };
    }
  };

  const theme = getTheme();

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/learn/profile"
        className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all cursor-pointer ${theme.bg} ${theme.border} border ${theme.shadow} ${currentUser.ageGroup === 'kids' ? 'active:translate-y-1 active:shadow-none' : 'hover:-translate-y-1'}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${theme.iconBg}`}>
          {AVATARS[currentUser.avatarIndex] || "🦊"}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-bold leading-tight ${theme.textName}`}>{currentUser.name}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${theme.textPoints}`}>⭐ {points}</span>
            <span className={`text-xs font-bold ${theme.textGems}`}>💎 {gems}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
