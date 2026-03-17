"use client";

import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";

export default function UniversalBackground() {
  const { currentUser } = useAuth();
  const { currentStreak } = useGamification();

  if (!currentUser) return null;

  if (currentUser.ageGroup === "kids") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: "4s" }}></div>
      </div>
    );
  }

  if (currentUser.ageGroup === "explorer") {
    const isDark = currentStreak > 5;
    if (isDark) {
      return (
        <div className="fixed inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-fuchsia-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-300 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50vw] h-[50vw] bg-emerald-200 rounded-full blur-[100px]" />
      </div>
    );
  }

  if (currentUser.ageGroup === "scholar") {
    const isDark = currentUser.themePreference !== "light";
    if (isDark) {
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-violet-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
    );
  }

  return null;
}
