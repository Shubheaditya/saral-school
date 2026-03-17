"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthState, User, AgeGroup, getAgeGroup, AVATARS } from "../types";

interface AuthContextType extends AuthState {
  login: (phone: string) => void;
  logout: () => void;
  createUser: (data: { name: string; phone: string; email?: string; birthdate: string; avatarIndex: number; parentPin: string; assignedSemester?: number }) => User;
  switchUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "saral_auth";

function loadAuth(): AuthState {
  if (typeof window === "undefined") return { isLoggedIn: false, currentUser: null, users: [] };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { isLoggedIn: false, currentUser: null, users: [] };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ isLoggedIn: false, currentUser: null, users: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadAuth());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const login = useCallback((phone: string) => {
    setState((prev) => {
      const user = prev.users.find((u) => u.phone === phone);
      if (user) {
        return { ...prev, isLoggedIn: true, currentUser: user };
      }
      // New user - will need onboarding
      return { ...prev, isLoggedIn: true, currentUser: null };
    });
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, isLoggedIn: false, currentUser: null }));
  }, []);

  const createUser = useCallback(
    (data: { name: string; phone: string; email?: string; birthdate: string; avatarIndex: number; parentPin: string; assignedSemester?: number }): User => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthdate: data.birthdate,
        avatarIndex: data.avatarIndex,
        ageGroup: getAgeGroup(data.birthdate, data.assignedSemester),
        parentPin: data.parentPin,
        assignedSemester: data.assignedSemester,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        currentUser: newUser,
        users: [...prev.users, newUser],
      }));
      return newUser;
    },
    []
  );

  const switchUser = useCallback((userId: string) => {
    setState((prev) => {
      const user = prev.users.find((u) => u.id === userId);
      return { ...prev, currentUser: user || prev.currentUser };
    });
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setState((prev) => {
      const users = prev.users.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          // If assignedSemester was changed, recalculate the ageGroup
          if (updates.assignedSemester !== undefined) {
             updated.ageGroup = getAgeGroup(updated.birthdate, updated.assignedSemester);
          }
          return updated;
        }
        return u;
      });
      const currentUser = prev.currentUser?.id === userId ? users.find(u => u.id === userId) as User : prev.currentUser;
      return { ...prev, users, currentUser };
    });
  }, []);

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ ...state, login, logout, createUser, switchUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
