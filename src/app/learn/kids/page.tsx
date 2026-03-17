"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useApp } from "../contexts/AppContext";
import Sparky from "../components/Sparky";
import TopProfileBar from "../components/TopProfileBar";
import UniversalBackground from "../components/UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Edible High-Contrast Color Palette
const EDIBLE_COLORS = [
  { bg: "bg-rose-400", border: "border-rose-600", shadow: "shadow-rose-300" },     // Watermelon
  { bg: "bg-amber-400", border: "border-amber-600", shadow: "shadow-amber-300" },  // Mango
  { bg: "bg-lime-400", border: "border-lime-600", shadow: "shadow-lime-300" },     // Apple
  { bg: "bg-violet-400", border: "border-violet-600", shadow: "shadow-violet-300" }, // Grape
  { bg: "bg-cyan-400", border: "border-cyan-600", shadow: "shadow-cyan-300" },      // Blueberry
  { bg: "bg-orange-400", border: "border-orange-600", shadow: "shadow-orange-300" }, // Orange
];

export default function KidsHomepage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { updateStreak } = useGamification();
  const { subjects } = useApp();
  const { backgroundClass, textClass } = useUniversalTheme();

  const [clickedSubject, setClickedSubject] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) { router.replace("/learn/login"); return; }
    updateStreak();
  }, [currentUser, router, updateStreak]);

  if (!currentUser) return null;

  const handleSubjectClick = (id: string) => {
    setClickedSubject(id);
    // Play a squish animation and delay routing slightly to allow it to finish
    setTimeout(() => {
      router.push(`/learn/subject/${id}`);
    }, 400);
  };

  return (
    <main className={`min-h-screen relative overflow-hidden select-none ${backgroundClass} ${textClass}`}>
      <UniversalBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="p-4 md:p-6 flex justify-between items-center bg-transparent">
           <TopProfileBar />
        </div>

        {/* Center: Sparky guiding the user and Subject toys */}
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-4 pb-12">
          
          <div className="flex flex-col items-center gap-6">
            <div className="relative animate-bounce" style={{ animationDuration: "3s" }}>
              <Sparky mood="celebrating" size="xl" />
            </div>

            {/* Squishy Start Button - Giant Size */}
            <button
              onClick={() => {
                const firstSubject = subjects[0];
                if (firstSubject) handleSubjectClick(firstSubject.id);
              }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-emerald-600 rounded-[3rem] top-3"></div>
              <div className="relative bg-lime-400 border-4 border-lime-300 rounded-[3rem] px-16 py-8 text-6xl shadow-xl flex items-center justify-center transform transition-transform duration-150 active:translate-y-3 group-active:translate-y-3 hover:brightness-110">
                🚀
              </div>
            </button>
          </div>

          {/* Subject toys - Skeuomorphic blocks */}
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap mt-4">
            {subjects.map((subject, idx) => {
              const color = EDIBLE_COLORS[idx % EDIBLE_COLORS.length];
              const isClicked = clickedSubject === subject.id;
              
              return (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject.id)}
                  className={`relative group touch-manipulation transition-transform duration-300 ${isClicked ? "scale-125 z-50 animate-pulse" : ""}`}
                  style={{ transformOrigin: "center bottom" }}
                >
                  {/* 3D Base (Shadow/Bottom edge) */}
                  <div className={`absolute inset-0 ${color.border} rounded-[2.5rem] top-3`}></div>
                  
                  {/* 3D Top surface */}
                  <div className={`relative ${color.bg} border-4 border-white/40 rounded-[2.5rem] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center text-6xl md:text-7xl shadow-lg transform transition-transform duration-150 group-active:translate-y-3 hover:brightness-110`}>
                    
                    {/* Highlight sheen for jelly effect */}
                    <div className="absolute top-2 left-4 right-4 h-4 bg-white/30 rounded-full blur-[2px]"></div>
                    
                    <span className="relative z-10 drop-shadow-md">{subject.icon}</span>
                    
                    {/* Click Particles (Simple CSS implementation) */}
                    {isClicked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-full h-full border-8 border-white rounded-[2.5rem] animate-ping opacity-0"></div>
                        <span className="absolute -top-10 text-3xl animate-bounce">✨</span>
                        <span className="absolute -left-8 top-10 text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</span>
                        <span className="absolute -right-8 top-10 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
