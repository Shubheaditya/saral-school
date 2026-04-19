"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import TopProfileBar from "../components/TopProfileBar";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Bright candy colors for subject cards
const CANDY_COLORS = [
  { bg: "bg-rose-50", border: "border-rose-200", accent: "bg-rose-400", text: "text-rose-700", hover: "hover:border-rose-400 hover:shadow-rose-200/50" },
  { bg: "bg-amber-50", border: "border-amber-200", accent: "bg-amber-400", text: "text-amber-700", hover: "hover:border-amber-400 hover:shadow-amber-200/50" },
  { bg: "bg-emerald-50", border: "border-emerald-200", accent: "bg-emerald-400", text: "text-emerald-700", hover: "hover:border-emerald-400 hover:shadow-emerald-200/50" },
  { bg: "bg-violet-50", border: "border-violet-200", accent: "bg-violet-400", text: "text-violet-700", hover: "hover:border-violet-400 hover:shadow-violet-200/50" },
  { bg: "bg-cyan-50", border: "border-cyan-200", accent: "bg-cyan-400", text: "text-cyan-700", hover: "hover:border-cyan-400 hover:shadow-cyan-200/50" },
  { bg: "bg-pink-50", border: "border-pink-200", accent: "bg-pink-400", text: "text-pink-700", hover: "hover:border-pink-400 hover:shadow-pink-200/50" },
];

export default function KidsHomepage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { updateStreak, currentStreak, completedQuizzes, completedVideos } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass } = useUniversalTheme();

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
  }, [currentUser, router, updateStreak]);

  if (!currentUser) return null;

  return (
    <main className={`min-h-screen relative overflow-hidden select-none ${backgroundClass} ${textClass}`}>
      <UniversalBackground />

      <div className="relative z-10 max-w-5xl mx-auto p-5 md:p-8 flex flex-col gap-6 min-h-screen">

        {/* Header */}
        <header className="flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Saral School" className="w-12 h-12 object-contain drop-shadow-sm rounded-xl bg-white p-1" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-purple-400 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-black text-white">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome back!</p>
                <h1 className="text-lg font-black text-slate-900">{currentUser.name}</h1>
              </div>
            </div>
          </div>
          <TopProfileBar />
        </header>

        {/* Stats Row - Playful version */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-4 border-2 border-orange-200 shadow-sm text-center bouncy-hover">
            <p className="text-3xl font-black text-orange-500">{currentStreak}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Day Streak</p>
          </div>
          <div className="bg-white rounded-3xl p-4 border-2 border-emerald-200 shadow-sm text-center bouncy-hover">
            <p className="text-3xl font-black text-emerald-500">{completedQuizzes.length}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Quizzes Done</p>
          </div>
          <div className="bg-white rounded-3xl p-4 border-2 border-purple-200 shadow-sm text-center bouncy-hover">
            <p className="text-3xl font-black text-purple-500">{completedVideos.length}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">Videos</p>
          </div>
        </div>

        {/* Subjects Label */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-black text-slate-900">My Subjects</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Tap a subject to start learning!</p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
          {subjects.map((subject, idx) => {
            const color = CANDY_COLORS[idx % CANDY_COLORS.length];
            const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);

            return (
              <button
                key={subject.id}
                onClick={() => router.push(`/learn/subject/${subject.id}`)}
                className={`group relative text-left ${color.bg} border-2 ${color.border} p-5 rounded-3xl transition-all duration-150 ${color.hover} hover:shadow-lg hover:-translate-y-1 active:scale-95 animate-fade-in-up`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${color.accent} flex items-center justify-center text-3xl shadow-inner border-2 border-white/50 group-hover:scale-110 transition-transform duration-150`}>
                    {subject.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-black ${color.text} mb-0.5`}>{subject.name}</h3>
                    <p className="text-sm font-bold text-slate-400">{totalChapters} Chapters</p>
                  </div>
                  <span className="text-slate-300 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 transform translate-x-2 group-hover:translate-x-0">&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </main>
  );
}
