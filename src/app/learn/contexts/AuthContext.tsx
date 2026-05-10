"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthState, User, AgeGroup, getAgeGroup, AVATARS } from "../types";

interface AuthContextType extends AuthState {
  login: (phone: string) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ isLoggedIn: false, currentUser: null, users: [] });
  const [loaded, setLoaded] = useState(false);

  const fetchUserFromDB = async (phone: string): Promise<User | null> => {
    try {
      const res = await fetch(`/api/user?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        if (data.error) return null;
        return data as User;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch user from DB", err);
      return null;
    }
  };

  const refreshUser = useCallback(async () => {
    // Check if we have a stored phone in localStorage
    const storedPhone = typeof window !== "undefined" ? localStorage.getItem("saral_phone") : null;
    if (storedPhone) {
      const dbUser = await fetchUserFromDB(storedPhone);
      if (dbUser) {
        setState({ isLoggedIn: true, currentUser: dbUser, users: [dbUser] });
      } else {
        // Phone exists in localStorage but no DB record — keep logged in state for onboarding
        setState({ isLoggedIn: true, currentUser: null, users: [] });
      }
    } else {
      setState({ isLoggedIn: false, currentUser: null, users: [] });
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoaded(true));
  }, [refreshUser]);

  const login = useCallback((phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (typeof window !== "undefined") {
      localStorage.setItem("saral_phone", cleaned);
    }
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("saral_phone");
    }
    setState({ isLoggedIn: false, currentUser: null, users: [] });
  }, []);

  const switchUser = useCallback((userId: string) => {
    // For multi-child: could be extended later
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    // Optimistic cache update
    setState((prev) => {
      if (!prev.currentUser) return prev;
      const updated = { ...prev.currentUser, ...updates };
      if (updates.assignedSemester !== undefined && updated.birthdate) {
        updated.ageGroup = getAgeGroup(updated.birthdate, updates.assignedSemester);
      }
      return { ...prev, currentUser: updated, users: [updated] };
    });

    // Persist to database via PATCH
    try {
      const patchBody: Record<string, any> = { id: userId, ...updates };
      if (updates.assignedSemester !== undefined) {
        const current = state.currentUser;
        if (current?.birthdate) {
          patchBody.ageGroup = getAgeGroup(current.birthdate, updates.assignedSemester);
        }
      }

      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody)
      });
    } catch (e) {
      console.error(e);
    }
  }, [state.currentUser]);

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchUser, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
