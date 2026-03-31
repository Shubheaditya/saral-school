"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import { AVATARS } from "../types";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Professional, muted accents for the "Pro-Tool" aesthetic
const SUBJECT_STYLES: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  math: { bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]", text: "text-blue-400" },
  science: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]", text: "text-emerald-400" },
  english: { bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]", text: "text-violet-400" },
  social: { bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]", text: "text-amber-400" },
  logic: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(217,70,239,0.15)]", text: "text-fuchsia-400" },
  tech: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]", text: "text-cyan-400" },
};

export default function ScholarHomepage() {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();
  const { updateStreak, totalMarks, currentStreak, completedQuizzes, completedVideos } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  // Simulated heatmap data
  const [heatmap, setHeatmap] = useState<number[]>([]);

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
    // Generate a beautiful, completely fake 90-day activity heatmap for the "pro" look
    const rawData = Array.from({ length: 90 }, () => Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0);
    // Ensure recent days show activity if streak > 0
    if (currentStreak > 0) {
      for (let i = 0; i < Math.min(currentStreak, 14); i++) {
         rawData[89 - i] = Math.floor(Math.random() * 3) + 2; 
      }
    }
    setHeatmap(rawData);
  }, [currentUser, router, updateStreak, currentStreak]);

  if (!currentUser) return null;

  const totalCompleted = completedQuizzes.length + completedVideos.length;

  const getSubjectProgress = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return 0;
    const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);
    if (totalChapters === 0) return 0;
    return Math.floor(12 + Math.random() * 30); // Simulated %
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} font-sans selection:bg-indigo-500/30 transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-10 flex flex-col gap-8 min-h-screen">
        
        {/* TOP NAVIGATION / COMMAND PALETTE TRIGGER */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'} border font-black flex items-center justify-center cursor-pointer transition-colors`} onClick={() => router.push("/learn/profile")}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Workspace</p>
              <h1 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{currentUser.name}'s Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
               onClick={() => updateUser(currentUser.id, { themePreference: isDark ? "light" : "dark" })}
               className={`w-8 h-8 flex items-center justify-center rounded-lg border ${isDark ? 'border-white/10 hover:bg-white/10 text-slate-400 hover:text-white' : 'border-black/10 hover:bg-black/5 text-slate-500 hover:text-slate-900'} transition-all`}
               title="Toggle Workspace Theme"
            >
               {isDark ? "🔆" : "🌙"}
            </button>
            {/* Fake Command Palette Trigger */}
            <button className={`hidden md:flex items-center gap-24 px-3 py-1.5 border rounded-md text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>
              <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Search course, note, or command...</span>
              <kbd className={`hidden sm:inline-block px-2 text-[10px] font-mono border rounded ${isDark ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>⌘K</kbd>
            </button>
            <button onClick={() => router.push("/learn/profile")} className={`w-8 h-8 flex items-center justify-center transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>
        </header>

        {/* OVERVIEW PANEL - Glassmorphic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Stat Block */}
          <div className={`lg:col-span-1 border rounded-2xl p-6 flex flex-col justify-between ${isDark ? 'bg-slate-900/50 backdrop-blur-xl border-white/10' : 'bg-white shadow-sm border-slate-200'}`}>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total Knowledge Graph</p>
              <div className="flex items-end gap-3">
                <h2 className={`text-4xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalMarks.toLocaleString()}</h2>
                <span className={`text-xs font-mono mb-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>+240 this week</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Active Streak
                  </div>
                  <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentStreak} days</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Core Tasks
                  </div>
                  <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCompleted} resolved</p>
               </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className={`lg:col-span-2 border rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 backdrop-blur-xl border-white/10' : 'bg-white shadow-sm border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-medium text-slate-500">Activity Overview</p>
              <div className="text-[10px] font-mono text-slate-400">Last 90 days</div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar justify-end">
              {/* Group into columns of 7 for that GitHub look */}
              {Array.from({ length: Math.ceil(90 / 7) }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1 shrink-0">
                  {heatmap.slice(colIdx * 7, (colIdx + 1) * 7).map((level, rowIdx) => {
                    // Map intensity to colors based on mode
                    let bg = isDark ? "bg-slate-800/50" : "bg-slate-100";
                    if (level === 1) bg = isDark ? "bg-indigo-900/60" : "bg-indigo-200";
                    if (level === 2) bg = isDark ? "bg-indigo-700/80" : "bg-indigo-400";
                    if (level === 3) bg = "bg-indigo-500";
                    if (level >= 4) bg = isDark ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]";

                    return (
                      <div 
                        key={rowIdx} 
                        className={`w-3 h-3 rounded-[2px] ${bg} transition-all duration-300 hover:ring-1 hover:ring-indigo-400`}
                        title={`Activity level: ${level}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-slate-500 font-mono">
               <span>Less</span>
               <div className="flex gap-1">
                  <div className={`w-2.5 h-2.5 rounded-[1px] ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-[1px] ${isDark ? 'bg-indigo-900/60' : 'bg-indigo-200'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-[1px] ${isDark ? 'bg-indigo-700/80' : 'bg-indigo-400'}`}></div>
                  <div className={`w-2.5 h-2.5 rounded-[1px] bg-indigo-500`}></div>
                  <div className={`w-2.5 h-2.5 rounded-[1px] ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
               </div>
               <span>More</span>
            </div>
          </div>
        </div>

        {/* COURSES & MODULES */}
        <div>
          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 mb-6">
            <h2 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Active Modules</h2>
            <div className={`flex gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
               <button className={isDark ? "text-white" : "text-slate-900 font-bold"}>All</button>
               <button className="hover:text-indigo-500 transition-colors">In Progress</button>
               <button className="hover:text-indigo-500 transition-colors">Completed</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const style = SUBJECT_STYLES[subject.id] || { bg: "bg-slate-800/30", border: "border-slate-700/50", glow: "group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]", text: "text-slate-400" };
              const progress = getSubjectProgress(subject.id);
              const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);
              
              const textFocus = isDark ? "group-hover:text-white text-slate-200" : "group-hover:text-indigo-600 text-slate-800";
              const cardBg = isDark ? "bg-slate-900/30 border-white/5 hover:bg-slate-800/50 hover:border-white/10" : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md";

              return (
                <button
                  key={subject.id}
                  onClick={() => router.push(`/learn/subject/${subject.id}`)}
                  className={`group relative text-left border p-5 rounded-xl transition-all duration-500 ease-out ${cardBg} ${isDark ? style.glow : ''}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${isDark ? style.bg : 'bg-slate-50'} border ${style.border} flex items-center justify-center text-xl`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium transition-colors ${textFocus}`}>{subject.name}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{totalChapters} Chapters</p>
                      </div>
                    </div>
                    {/* Minimalist Progress Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2" className={isDark ? "text-slate-800" : "text-slate-100"} />
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - progress} className={`${style.text} transition-all duration-1000 ease-out`} />
                       </svg>
                       <span className={`absolute text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{progress}%</span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                     <span className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'} group-hover:${style.bg.replace('/10', '')} transition-colors`}></div> Last accessed 2d ago</span>
                     <span className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 ${isDark ? '' : 'text-indigo-500 font-bold'}`}>Enter →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <style jsx global>{`
        body { background-color: ${isDark ? '#0A0A0A' : '#F8FAFC'}; transition: background-color 0.5s ease; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}; }
      `}</style>
    </main>
  );
}
