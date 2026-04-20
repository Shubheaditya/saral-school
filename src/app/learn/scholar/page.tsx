"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import { AVATARS } from "../types";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Rose/mauve-tinted subject accents matching the logo palette
const SUBJECT_STYLES: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  math: { bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(244,63,94,0.12)]", text: "text-rose-500" },
  science: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]", text: "text-emerald-500" },
  english: { bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.12)]", text: "text-purple-500" },
  social: { bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(245,158,11,0.12)]", text: "text-amber-500" },
  logic: { bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(217,70,239,0.12)]", text: "text-fuchsia-500" },
  tech: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "group-hover:shadow-[0_0_15px_rgba(6,182,212,0.12)]", text: "text-cyan-500" },
};

export default function ScholarHomepage() {
  const router = useRouter();
  const { currentUser, updateUser } = useAuth();
  const { updateStreak, points, currentStreak, completedQuizzes, completedVideos } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass } = useUniversalTheme();

  // Simulated heatmap data
  const [heatmap, setHeatmap] = useState<number[]>([]);

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
    const rawData = Array.from({ length: 90 }, () => Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0);
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
    return Math.floor(12 + Math.random() * 30); // Simulated %
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} font-sans selection:bg-rose-500/30 transition-colors duration-200`}>
      <UniversalBackground />

      <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-10 flex flex-col gap-8 min-h-screen">
        
        {/* TOP NAVIGATION */}
        <header className="flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-5">
            <img src="/logo.png" alt="Saral School" className="w-10 h-10 object-contain drop-shadow-sm rounded-lg bg-white p-1" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 border-2 border-white text-white font-black flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-shadow" onClick={() => router.push("/learn/profile")}>
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Workspace</p>
                <h1 className="text-sm font-medium text-slate-900">{currentUser.name}&apos;s Dashboard</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <button className="hidden md:flex items-center gap-24 px-3 py-1.5 border rounded-md text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-rose-500/50 bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-rose-300 shadow-sm">
              <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>Search course, note, or command...</span>
              <kbd className="hidden sm:inline-block px-2 text-[10px] font-mono border rounded border-slate-200 bg-slate-100 text-slate-500">⌘K</kbd>
            </button>
            <button onClick={() => router.push("/learn/profile")} className="w-8 h-8 flex items-center justify-center transition-colors text-slate-500 hover:text-rose-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </button>
          </div>
        </header>

        {/* OVERVIEW PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          
          {/* Main Stat Block */}
          <div className="lg:col-span-1 border rounded-2xl p-6 flex flex-col justify-between bg-white shadow-sm border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total Knowledge Graph</p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-light tracking-tight text-slate-900">{points.toLocaleString()}</h2>
                <span className="text-xs font-mono mb-1.5 text-emerald-600">+240 this week</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
               <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Active Streak
                  </div>
                  <p className="text-lg font-medium text-slate-900">{currentStreak} days</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Core Tasks
                  </div>
                  <p className="text-lg font-medium text-slate-900">{totalCompleted} resolved</p>
               </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="lg:col-span-2 border rounded-2xl p-6 bg-white shadow-sm border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-medium text-slate-500">Activity Overview</p>
              <div className="text-[10px] font-mono text-slate-400">Last 90 days</div>
            </div>
            
            {/* Heatmap Grid */}
            <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar justify-end">
              {Array.from({ length: Math.ceil(90 / 7) }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1 shrink-0">
                  {heatmap.slice(colIdx * 7, (colIdx + 1) * 7).map((level, rowIdx) => {
                    let bg = "bg-slate-100";
                    if (level === 1) bg = "bg-rose-200";
                    if (level === 2) bg = "bg-rose-400";
                    if (level === 3) bg = "bg-rose-500";
                    if (level >= 4) bg = "bg-purple-600 shadow-[0_0_8px_rgba(168,85,247,0.3)]";

                    return (
                      <div 
                        key={rowIdx} 
                        className={`w-3 h-3 rounded-[2px] ${bg} transition-all duration-300 hover:ring-1 hover:ring-rose-400`}
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
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-slate-100"></div>
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-rose-200"></div>
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-[1px] bg-purple-600"></div>
               </div>
               <span>More</span>
            </div>
          </div>
        </div>

        {/* SEMESTER SELECTOR */}
        <div className="animate-fade-in-up">
          <div className="border rounded-xl p-4 bg-white shadow-sm border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <p className="text-xs font-medium text-slate-500">Current Semester</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gradient-to-r from-rose-500 to-purple-500 text-white">
                Semester {currentUser.assignedSemester || 10}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {Array.from({ length: 9 }, (_, i) => (
                <button
                  key={i + 10}
                  onClick={() => {
                    updateUser(currentUser.id, { assignedSemester: i + 10 });
                    setTimeout(() => { window.location.href = "/learn"; }, 300);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    (currentUser.assignedSemester || 10) === i + 10
                      ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-rose-50 hover:border-rose-300"
                  }`}
                >
                  Sem {i + 10}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COURSES & MODULES */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-sm font-medium text-slate-800">Active Modules</h2>
            <div className="flex gap-4 text-xs text-slate-400">
               <button className="text-slate-900 font-bold">All</button>
               <button className="hover:text-rose-500 transition-colors">In Progress</button>
               <button className="hover:text-rose-500 transition-colors">Completed</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
            {subjects.map((subject) => {
              const style = SUBJECT_STYLES[subject.id] || { bg: "bg-slate-100", border: "border-slate-200", glow: "", text: "text-slate-500" };
              const progress = getSubjectProgress(subject.id);
              const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);

              return (
                <button
                  key={subject.id}
                  onClick={() => router.push(`/learn/subject/${subject.id}`)}
                  className={`group relative text-left border p-5 rounded-xl transition-all duration-200 ease-out bg-white border-slate-200 hover:border-rose-200 hover:shadow-md ${style.glow}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-slate-50 border ${style.border} flex items-center justify-center text-xl`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium transition-colors group-hover:text-rose-600 text-slate-800">{subject.name}</h3>
                        <p className="text-xs text-slate-400">{totalChapters} Chapters</p>
                      </div>
                    </div>
                    {/* Progress Ring */}
                    <div className="relative w-10 h-10 flex items-center justify-center">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-slate-100" />
                          <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - progress} className={`${style.text} transition-all duration-200 ease-out`} />
                       </svg>
                       <span className="absolute text-[9px] font-mono text-slate-500">{progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                     <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Last accessed 2d ago</span>
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 text-rose-500 font-bold">Enter →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.2); }
      `}</style>
    </main>
  );
}
