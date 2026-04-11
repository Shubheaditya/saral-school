"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import TopProfileBar from "../components/TopProfileBar";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Explorer gradient themes for each subject
const EXPLORER_THEMES: Record<string, { gradient: string; shadow: string; iconBg: string }> = {
  math: { gradient: "from-blue-600 via-indigo-600 to-purple-700", shadow: "shadow-indigo-500/30", iconBg: "bg-blue-400/20" },
  science: { gradient: "from-emerald-500 via-teal-500 to-cyan-600", shadow: "shadow-teal-500/30", iconBg: "bg-emerald-400/20" },
  english: { gradient: "from-rose-500 via-pink-600 to-purple-600", shadow: "shadow-pink-500/30", iconBg: "bg-rose-400/20" },
  social: { gradient: "from-amber-500 via-orange-500 to-red-600", shadow: "shadow-orange-500/30", iconBg: "bg-amber-400/20" },
  logic: { gradient: "from-violet-600 via-purple-600 to-fuchsia-700", shadow: "shadow-purple-500/30", iconBg: "bg-violet-400/20" },
  tech: { gradient: "from-cyan-500 via-sky-600 to-blue-700", shadow: "shadow-cyan-500/30", iconBg: "bg-cyan-400/20" },
};

export default function ExplorerHomepage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { updateStreak, currentStreak, completedQuizzes, completedVideos } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
  }, [currentUser, router, updateStreak]);

  if (!currentUser) return null;

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-hidden font-sans transition-colors duration-200`}>
      <UniversalBackground />

      <div className="relative z-10 max-w-5xl mx-auto p-5 md:p-8 flex flex-col gap-6 min-h-screen">

        {/* Header */}
        <header className="flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-slate-700' : 'bg-gradient-to-br from-indigo-400 to-purple-500 border-white'} border-4 shadow-lg flex items-center justify-center text-2xl font-black text-white`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Explorer Dashboard</p>
              <h1 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</h1>
            </div>
          </div>
          <TopProfileBar />
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className={`rounded-2xl p-4 border text-center bouncy-hover ${isDark ? 'bg-slate-900/60 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className={`text-3xl font-black ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>{currentStreak}</p>
            <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Day Streak</p>
          </div>
          <div className={`rounded-2xl p-4 border text-center bouncy-hover ${isDark ? 'bg-slate-900/60 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className={`text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>{completedQuizzes.length}</p>
            <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quizzes Done</p>
          </div>
          <div className={`rounded-2xl p-4 border text-center bouncy-hover ${isDark ? 'bg-slate-900/60 border-white/10 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className={`text-3xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-500'}`}>{completedVideos.length}</p>
            <p className={`text-xs font-bold mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Videos</p>
          </div>
        </div>

        {/* Subjects Label */}
        <div className="animate-fade-in-up">
          <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Quests</h2>
          <p className={`text-sm font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select a quest to continue your adventure.</p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
          {subjects.map((subject, idx) => {
            const theme = EXPLORER_THEMES[subject.id] || { gradient: "from-slate-600 to-slate-800", shadow: "shadow-slate-500/30", iconBg: "bg-white/10" };
            const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);

            return (
              <button
                key={subject.id}
                onClick={() => router.push(`/learn/subject/${subject.id}`)}
                className={`group relative text-left border p-1 rounded-2xl transition-all duration-150 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${theme.shadow} animate-fade-in-up`}
              >
                {/* Gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-2xl`}></div>
                
                {/* Inner card */}
                <div className={`relative h-full w-full rounded-[0.9rem] ${isDark ? 'bg-slate-900/95' : 'bg-white/97'} backdrop-blur-xl p-5 flex items-center gap-4 overflow-hidden border border-white/10`}>
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-150`}>
                    <span className="relative z-10">{subject.icon}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className={`text-lg font-black mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{subject.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>Quest {idx + 1}</span>
                      <p className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{totalChapters} stages</p>
                    </div>
                  </div>

                  <span className={`text-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-slate-400' : 'text-indigo-400'}`}>&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </main>
  );
}
