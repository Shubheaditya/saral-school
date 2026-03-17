"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import TopProfileBar from "../components/TopProfileBar";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Hyper-Gradients for the 'Adventure/Gamer' aesthetic
const SUBJECT_THEMES: Record<string, { gradient: string; shadow: string; emoji2: string; iconBg: string }> = {
  math: { gradient: "from-blue-600 via-indigo-600 to-purple-700", shadow: "shadow-indigo-500/40", emoji2: "⚔️", iconBg: "bg-blue-400/20" },
  science: { gradient: "from-emerald-500 via-teal-500 to-cyan-600", shadow: "shadow-teal-500/40", emoji2: "🧪", iconBg: "bg-emerald-400/20" },
  english: { gradient: "from-rose-500 via-pink-600 to-purple-600", shadow: "shadow-pink-500/40", emoji2: "📜", iconBg: "bg-rose-400/20" },
  social: { gradient: "from-amber-500 via-orange-500 to-red-600", shadow: "shadow-orange-500/40", emoji2: "🗺️", iconBg: "bg-amber-400/20" },
  logic: { gradient: "from-violet-600 via-purple-600 to-fuchsia-700", shadow: "shadow-purple-500/40", emoji2: "🧩", iconBg: "bg-violet-400/20" },
  tech: { gradient: "from-cyan-500 via-sky-600 to-blue-700", shadow: "shadow-cyan-500/40", emoji2: "⚡", iconBg: "bg-cyan-400/20" },
};

// Dynamic background theme based on fake 'level' calculated from streak
export default function ExplorerHomepage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { updateStreak, currentStreak } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
  }, [currentUser, router, updateStreak]);

  if (!currentUser) return null;

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-hidden font-sans transition-colors duration-1000`}>
      <UniversalBackground />

      <div className="relative z-10 min-h-screen pb-24 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-8 lg:pt-12 max-w-7xl mx-auto w-full">
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-900'}`}>
            <span>🚀</span>
            Explorer Map
          </h1>
          <TopProfileBar />
        </div>

        {/* MAIN LAYOUT */}
        <div className="w-full max-w-7xl mx-auto flex gap-12 px-4 md:px-8">
          
          {/* LEFT: Quest Map */}
          <div className="flex-1 flex flex-col items-center xl:items-start max-w-4xl mx-auto xl:mx-0 w-full relative">
            <div className="mb-8 text-center xl:text-left">
              <h2 className={`text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Quests</h2>
              <p className={`font-medium mt-2 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Select a path to continue your adventure.</p>
            </div>
          

          {/* Isometric / Zig-Zag Layout container */}
          <div className="w-full relative max-w-4xl mx-auto py-10">
            {/* Draw the connecting path line behind the nodes */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1.5 md:w-2 -translate-x-1/2 bg-gradient-to-b from-indigo-500/50 via-emerald-500/50 to-fuchsia-500/50 rounded-full hidden md:block opacity-50"></div>

            <div className="space-y-6 md:space-y-0 relative">
              {subjects.map((subject, idx) => {
                const theme = SUBJECT_THEMES[subject.id] || { gradient: "from-slate-600 to-slate-800", shadow: "shadow-slate-500/40", emoji2: "📘", iconBg: "bg-white/10" };
                const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);
                
                // Determine layout staggering
                const isEven = idx % 2 === 0;
                const alignmentClass = "md:w-[45%]";
                const positionClass = "md:absolute w-full";
                const leftPos = isEven ? "md:left-0 md:pr-16" : "md:right-0 md:pl-16 text-left";
                
                // Calculate vertical position for absolute layout
                const topOffset = idx * 160; // 160px vertical spacing per row

                return (
                  <div key={subject.id} className={`w-full ${alignmentClass} ${positionClass} ${leftPos}`} style={{ top: `${topOffset}px` }}>
                    
                    {/* The Dot on the Path connecting the UI elements - desktop only */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 ${isDark ? 'bg-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-white border-slate-900 shadow-xl'} z-20 ${isEven ? '-right-[29px]' : '-left-[27px]'}`}></div>

                    <button
                      onClick={() => router.push(`/learn/subject/${subject.id}`)}
                      className={`w-full group relative block rounded-[2rem] p-1 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] active:scale-[0.98] md:hover:-translate-y-2 md:hover:scale-110 shadow-xl ${theme.shadow}`}
                    >
                      {/* Hyper-Gradient Border Wrap */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-[2rem] opacity-100`}></div>
                      
                      {/* Inner Card Content */}
                      <div className={`relative h-full w-full rounded-[1.8rem] ${isDark ? 'bg-slate-900/90' : 'bg-white/95'} backdrop-blur-xl p-6 flex items-center gap-5 overflow-hidden border border-white/20`}>
                        
                        {/* Foil Shine Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></div>

                        <div className={`w-20 h-20 rounded-2xl ${theme.gradient} flex items-center justify-center text-4xl shadow-inner shrink-0 relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                          <div className={`absolute inset-0 ${theme.iconBg} backdrop-blur-sm z-10`}></div>
                          <span className="relative z-20">{subject.icon}</span>
                          <span className="absolute -bottom-2 -right-2 text-5xl opacity-20 z-0">{theme.emoji2}</span>
                        </div>
                        
                        <div className="flex flex-col text-left">
                          <h3 className={`text-2xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{subject.name}</h3>
                          <div className="flex items-center gap-2">
                             <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                               Quest {idx + 1}
                             </div>
                             <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{totalChapters} stages</p>
                          </div>
                        </div>

                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            {/* Invisible spacer to maintain layout height because of absolute positioning on desktop */}
            <div className={`hidden md:block`} style={{ height: `${subjects.length * 160 + 100}px` }}></div>
          </div>
          
        </div>
      </div>
      </div>
    </main>
  );
}
