import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function useUniversalTheme() {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentUser) {
    return { backgroundClass: "bg-white", textClass: "text-slate-900", isDark: false };
  }

  if (currentUser.ageGroup === "kids") {
    return { backgroundClass: "bg-rose-50", textClass: "text-slate-900", isDark: false };
  }

  // Scholar — light mode only
  return {
    backgroundClass: "bg-[#F8FAFC]",
    textClass: "text-slate-700",
    isDark: false,
  };
}
