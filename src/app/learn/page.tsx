"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";

export default function LearnPage() {
  const router = useRouter();
  const { isLoggedIn, currentUser } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/learn/login");
      return;
    }
    if (!currentUser) {
      router.replace("/learn/onboarding");
      return;
    }
    // Redirect to age-appropriate homepage
    switch (currentUser.ageGroup) {
      case "kids":
        router.replace("/learn/kids");
        break;
      case "scholar":
      default:
        router.replace("/learn/scholar");
        break;
    }
  }, [isLoggedIn, currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-float">
        <span className="text-6xl">🦉</span>
      </div>
    </div>
  );
}
