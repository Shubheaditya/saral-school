import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";

export function useUniversalTheme() {
  const { currentUser } = useAuth();
  const { currentStreak } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentUser) {
    return { backgroundClass: "bg-white", textClass: "text-slate-900", isDark: false };
  }

  if (currentUser.ageGroup === "kids") {
    return { backgroundClass: "bg-sky-100", textClass: "text-slate-900", isDark: false };
  }

  if (currentUser.ageGroup === "explorer") {
    let backgroundClass = "bg-slate-100";
    let textClass = "text-slate-900";
    let isDark = false;

    if (currentStreak > 15) {
      backgroundClass = "bg-slate-900";
      textClass = "text-white";
      isDark = true;
    } else if (currentStreak > 5) {
      backgroundClass = "bg-indigo-950";
      textClass = "text-white";
      isDark = true;
    }

    return { backgroundClass, textClass, isDark };
  }

  if (currentUser.ageGroup === "scholar") {
    const isDark = currentUser.themePreference !== "light";
    return {
      backgroundClass: isDark ? "bg-[#0A0A0A]" : "bg-[#F8FAFC]",
      textClass: isDark ? "text-slate-300" : "text-slate-700",
      isDark,
    };
  }

  return { backgroundClass: "bg-white", textClass: "text-slate-900", isDark: false };
}
