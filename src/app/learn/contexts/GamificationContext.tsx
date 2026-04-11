"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GamificationState, Badge } from "../types";
import { DEFAULT_BADGES } from "../mockData";
import { useAuth } from "./AuthContext";

interface GamificationContextType extends GamificationState {
  addPoints: (amount: number) => void;
  addGems: (amount: number) => void;
  updateStreak: () => void;
  completeQuiz: (quizId: string) => void;
  completeVideo: (videoId: string) => void;
  earnBadge: (badgeId: string) => void;
  checkAndAwardBadges: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "saral_gamification_local"; 

function getDefaultState(): GamificationState {
  return {
    points: 0,
    gems: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    badges: DEFAULT_BADGES.map((b) => ({ ...b })),
    completedQuizzes: [],
    completedVideos: [],
  };
}

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [state, setState] = useState<GamificationState>(getDefaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If the user is logged in natively via our new DB architecture
    if (currentUser && (currentUser as any).stats) {
       const rawStats = (currentUser as any).stats;
       setState(prev => ({
         ...prev,
         points: rawStats.points ?? 0,
         gems: rawStats.gems ?? 0,
         currentStreak: rawStats.currentStreak ?? 0,
         longestStreak: rawStats.longestStreak ?? 0,
         lastActiveDate: rawStats.lastActiveDate ?? ""
       }));
    }
    setLoaded(true);
  }, [currentUser]);

  // Sync to backend DB when points/gems change
  const syncToDB = useCallback(async (pointsToAdd: number, gemsToAdd: number, doUpdateStreak: boolean = false) => {
     if (!currentUser?.id) return;
     try {
       await fetch("/api/user/stats", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           userId: currentUser.id,
           pointsToAdd,
           gemsToAdd,
           updateStreak: doUpdateStreak
         })
       });
     } catch(e) {
       console.error("Failed to sync stats", e);
     }
  }, [currentUser]);

  const addPoints = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, points: prev.points + amount }));
    syncToDB(amount, 0);
  }, [syncToDB]);

  const addGems = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, gems: prev.gems + amount }));
    syncToDB(0, amount);
  }, [syncToDB]);

  const updateStreak = useCallback(() => {
    setState((prev) => {
      const today = new Date().toISOString().split("T")[0];
      if (prev.lastActiveDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak = prev.lastActiveDate === yesterdayStr ? prev.currentStreak + 1 : 1;
      const longestStreak = Math.max(newStreak, prev.longestStreak);

      syncToDB(0, 0, true);

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: today,
      };
    });
  }, [syncToDB]);

  const completeQuiz = useCallback((quizId: string) => {
    setState((prev) => {
      if (prev.completedQuizzes.includes(quizId)) return prev;
      return { ...prev, completedQuizzes: [...prev.completedQuizzes, quizId] };
    });
  }, []);

  const completeVideo = useCallback((videoId: string) => {
    setState((prev) => {
      if (prev.completedVideos.includes(videoId)) return prev;
      return { ...prev, completedVideos: [...prev.completedVideos, videoId] };
    });
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    setState((prev) => ({
      ...prev,
      badges: prev.badges.map((b) =>
        b.id === badgeId && !b.earned ? { ...b, earned: true, earnedAt: new Date().toISOString() } : b
      ),
    }));
  }, []);

  const checkAndAwardBadges = useCallback(() => {
    setState((prev) => {
      const badges = prev.badges.map((b) => {
        if (b.earned) return b;
        let shouldEarn = false;

        switch (b.id) {
          case "first-quiz":
            shouldEarn = prev.completedQuizzes.length >= 1;
            break;
          case "five-quizzes":
            shouldEarn = prev.completedQuizzes.length >= 5;
            break;
          case "three-streak":
            shouldEarn = prev.currentStreak >= 3;
            break;
          case "seven-streak":
            shouldEarn = prev.currentStreak >= 7;
            break;
          case "first-video":
            shouldEarn = prev.completedVideos.length >= 1;
            break;
          case "hundred-points":
            shouldEarn = prev.points >= 100;
            break;
        }

        if (shouldEarn) {
          return { ...b, earned: true, earnedAt: new Date().toISOString() };
        }
        return b;
      });
      return { ...prev, badges };
    });
  }, []);

  if (!loaded) return null;

  return (
    <GamificationContext.Provider
      value={{
        ...state,
        addPoints,
        addGems,
        updateStreak,
        completeQuiz,
        completeVideo,
        earnBadge,
        checkAndAwardBadges,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
