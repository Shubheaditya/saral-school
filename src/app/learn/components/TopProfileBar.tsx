"use client";

import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { AVATARS } from "../types";
import Link from "next/link";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

export default function TopProfileBar() {
  const { currentUser, updateUser } = useAuth();

  if (!currentUser) return null;

  const { isDark } = useUniversalTheme();
  
  const getTheme = () => {
    switch (currentUser.ageGroup) {
      case "kids":
         return { bg: "bg-white", border: "border-indigo-100", shadow: "shadow-[0_4px_0_#e0e7ff]", textName: "text-slate-900", iconBg: "bg-indigo-100 text-indigo-500", textPoints: "text-amber-500", textGems: "text-indigo-500" };
      case "explorer":
         return { 
           bg: isDark ? "bg-slate-900/50 backdrop-blur-md" : "bg-white/80 backdrop-blur-md", 
           border: isDark ? "border-white/10" : "border-slate-200", 
           shadow: isDark ? "shadow-xl border-t border-white/20" : "shadow-sm border-t border-slate-100", 
           textName: isDark ? "text-white" : "text-slate-900", 
           iconBg: isDark ? "bg-slate-800 text-white shadow-inner" : "bg-slate-100 text-slate-700 shadow-inner", 
           textPoints: "text-amber-500", 
           textGems: isDark ? "text-cyan-400" : "text-emerald-500" 
         };
      case "scholar":
      default:
         return { 
           bg: isDark ? "bg-slate-900/80 backdrop-blur-lg" : "bg-white/90 backdrop-blur-md", 
           border: isDark ? "border-slate-800" : "border-slate-200", 
           shadow: isDark ? "shadow-2xl" : "shadow-sm", 
           textName: isDark ? "text-slate-200" : "text-slate-900", 
           iconBg: isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600",
           textPoints: isDark ? "text-amber-500/80" : "text-amber-600",
           textGems: isDark ? "text-indigo-400/80" : "text-indigo-600"
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
        <div className="flex flex-col justify-center">
          <span className={`text-sm font-bold leading-tight ${theme.textName}`}>{currentUser.name}</span>
        </div>
      </Link>

      {/* Theme Toggle uniquely for Scholar (Older Kids) as requested */}
      {currentUser.ageGroup === "scholar" && (
        <button
          onClick={() => updateUser(currentUser.id, { themePreference: currentUser.themePreference === 'light' ? 'dark' : 'light' })}
          className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl transition-all border ${theme.bg} ${theme.border} ${theme.shadow} hover:-translate-y-1`}
          title="Toggle Theme"
        >
          <span className="text-xl drop-shadow-sm">{currentUser.themePreference === 'light' ? '🌙' : '☀️'}</span>
        </button>
      )}
    </div>
  );
}
