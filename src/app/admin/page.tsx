"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

const ADMIN_USER = "admin";
const ADMIN_PASS = "saralschool2026";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("saral_admin", "true");
      }
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Saral School Logo" width={48} height={48} className="mx-auto mb-2 object-contain" />
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Saral School Content Management</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:outline-none text-sm"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-400 focus:outline-none text-sm"
              placeholder="Enter password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}
