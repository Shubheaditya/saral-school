"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthState, User, AgeGroup, getAgeGroup, AVATARS } from "../types";
import { supabase } from "@/lib/supabase";

interface AuthContextType extends AuthState {
  login: (email: string) => void;
  logout: () => void;
  createUser?: any; // Marked as optional for backwards compatibility in other pages just in case
  switchUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ isLoggedIn: false, currentUser: null, users: [] });
  const [loaded, setLoaded] = useState(false);

  const fetchUserFromDB = async (userId: string): Promise<User | null> => {
    try {
      const res = await fetch(`/api/user?id=${userId}`);
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
     const { data } = await supabase.auth.getSession();
     if (data.session) {
         const dbUser = await fetchUserFromDB(data.session.user.id);
         if (dbUser) {
             setState({ isLoggedIn: true, currentUser: dbUser, users: [dbUser] });
         } else {
             setState({ isLoggedIn: true, currentUser: null, users: [] }); // Needs onboarding
         }
     } else {
         setState({ isLoggedIn: false, currentUser: null, users: [] });
     }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoaded(true));

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const dbUser = await fetchUserFromDB(session.user.id);
        if (dbUser) {
            setState({ isLoggedIn: true, currentUser: dbUser, users: [dbUser] });
        } else {
            setState({ isLoggedIn: true, currentUser: null, users: [] });
        }
      } else {
        setState({ isLoggedIn: false, currentUser: null, users: [] });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshUser]);

  const login = useCallback((email: string) => {
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ isLoggedIn: false, currentUser: null, users: [] });
  }, []);

  const switchUser = useCallback((userId: string) => {
    // For now we only support 1 user profile per supabase identity.
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    let finalUpdates = { ...updates };

    // Optimistic cache update
    setState((prev) => {
      if (!prev.currentUser) return prev;
      const updated = { ...prev.currentUser, ...updates };
      if (updates.assignedSemester !== undefined && updated.birthdate) {
          updated.ageGroup = getAgeGroup(updated.birthdate, updates.assignedSemester);
          finalUpdates.ageGroup = updated.ageGroup;
      }
      return { ...prev, currentUser: updated, users: [updated] };
    });

    // Best-effort remote update
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, ...finalUpdates })
      });
    } catch(e) {
      console.error(e);
    }
  }, []);

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
