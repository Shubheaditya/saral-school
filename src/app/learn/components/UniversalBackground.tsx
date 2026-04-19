"use client";

import { useAuth } from "../contexts/AuthContext";

export default function UniversalBackground() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  if (currentUser.ageGroup === "kids") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] bg-rose-100/40 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: "4s" }}></div>
      </div>
    );
  }

  // Scholar — subtle rose/purple blobs, light mode
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-rose-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px]"></div>
    </div>
  );
}
