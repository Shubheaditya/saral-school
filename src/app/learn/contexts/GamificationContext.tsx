"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GamificationState, Badge } from "../types";
import { DEFAULT_BADGES } from "../mockData";

interface GamificationContextType extends GamificationState {
  addMarks: (amount: number) => void;
  updateStreak: () => void;
  completeQuiz: (quizId: string) => void;
  completeVideo: (videoId: string) => void;
  earnBadge: (badgeId: string) => void;
  checkAndAwardBadges: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "saral_gamification";

function getDefaultState(): GamificationState {
  return {
    totalMarks: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    badges: DEFAULT_BADGES.map((b) => ({ ...b })),
    completedQuizzes: [],
    completedVideos: [],
  };
}

function loadState(): GamificationState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return getDefaultState();
}

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>(getDefaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const addMarks = useCallback((amount: number) => {
    setState((prev) => ({ ...prev, totalMarks: prev.totalMarks + amount }));
  }, []);

  const updateStreak = useCallback(() => {
    setState((prev) => {
      const today = new Date().toISOString().split("T")[0];
      if (prev.lastActiveDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak = prev.lastActiveDate === yesterdayStr ? prev.currentStreak + 1 : 1;
      const longestStreak = Math.max(newStreak, prev.longestStreak);

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: today,
      };
    });
  }, []);

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
            shouldEarn = prev.totalMarks >= 100;
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
        addMarks,
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
