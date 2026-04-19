import { useState } from "react";
import { Subject, Semester, Chapter, ContentItem } from "../types";
import TopProfileBar from "./TopProfileBar";
import Sparky from "./Sparky";
import UniversalBackground from "./UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

const EDIBLE_COLORS = [
  { bg: "bg-rose-400", border: "border-rose-600", shadow: "shadow-rose-300" },     // Watermelon
  { bg: "bg-amber-400", border: "border-amber-600", shadow: "shadow-amber-300" },  // Mango
  { bg: "bg-lime-400", border: "border-lime-600", shadow: "shadow-lime-300" },     // Apple
  { bg: "bg-violet-400", border: "border-violet-600", shadow: "shadow-violet-300" }, // Grape
  { bg: "bg-cyan-400", border: "border-cyan-600", shadow: "shadow-cyan-300" },      // Blueberry
];

export default function KidsSubjectView({ 
  subject, 
  onAction, 
  router,
  currentUser 
}: { 
  subject: Subject; 
  onAction: (type: "video" | "notes" | "practice", id: string) => void;
  router: any;
  currentUser: import("../types").User | null;
}) {
  // FIND THE ACTIVE SEMESTER
  const defaultSemNum = currentUser?.ageGroup === "scholar" ? 11 : currentUser?.ageGroup === "explorer" ? 5 : 1;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject.semesters[0];
  const semestersToDisplay = activeSemester ? [activeSemester] : [];

  const initialChapter = semestersToDisplay.find(s => s.chapters.length > 0)?.id || null;
  const [activeChapter, setActiveChapter] = useState<string | null>(initialChapter);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  
  const { backgroundClass, textClass } = useUniversalTheme();

  const handleActionClick = (type: "video" | "notes" | "practice", id: string) => {
    setClickedItem(`${type}-${id}`);
    setTimeout(() => {
      onAction(type, id);
      setClickedItem(null);
    }, 400);
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-x-hidden relative pb-32 font-sans select-none transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
        {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-transparent p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="w-16 h-16 bg-white border-b-8 border-slate-200 rounded-full flex items-center justify-center text-3xl shadow-md active:border-b-0 active:translate-y-2 transition-all"
          >
            ⬅️
          </button>
          <img src="/logo.png" alt="Saral School" className="w-12 h-12 object-contain drop-shadow-md rounded-xl bg-white p-1" />
        </div>
        <TopProfileBar />
      </div>

      <div className="mt-4 flex flex-col items-center mb-8 px-4">
        <div className="relative animate-bounce w-24 h-24 mb-4" style={{ animationDuration: "3s" }}>
          <Sparky mood="celebrating" size="lg" />
        </div>
        <div className="bg-white border-b-8 border-slate-200 rounded-[2rem] px-8 py-4 flex items-center gap-4">
           <span className="text-6xl">{subject.icon}</span>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 relative mb-32">
        <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
        {/* Playful Spread of Chapters */}
        {semestersToDisplay.filter(s => s.chapters.length > 0).map((chapter, chapIdx) => {
          const color = EDIBLE_COLORS[chapIdx % EDIBLE_COLORS.length];
          const isOpen = activeChapter === chapter.id;

          return (
            <div key={chapter.id} className={`relative flex flex-col items-center transition-all duration-500 ${isOpen ? 'w-full basis-full mt-4 mb-12' : 'w-full max-w-[280px]'}`}>

              {/* Big Squishy Chapter Button */}
              <button
                onClick={() => setActiveChapter(isOpen ? null : chapter.id)}
                className={`group relative transition-transform duration-300 w-full ${!isOpen && 'hover:-translate-y-2'}`}
                style={{ maxWidth: isOpen ? "320px" : "100%", transformOrigin: "center bottom" }}
              >
                <div className={`absolute inset-0 ${color.border} rounded-[3rem] top-3 shadow-lg`}></div>
                <div className={`relative ${color.bg} border-4 border-white/40 rounded-[3rem] px-6 py-8 shadow-xl flex items-center justify-center gap-4 active:translate-y-2 transition-all`}>
                    <div className="absolute top-2 left-6 right-6 h-4 bg-white/30 rounded-full blur-[2px]"></div>
                    <span className="text-6xl text-white font-black drop-shadow-md">{chapIdx + 1}</span>
                    <span className={`text-4xl transition-transform duration-300 ${isOpen ? '-rotate-180' : ''}`}>🔽</span>
                </div>
              </button>

              {/* Opened Subtopics directly below */}
              {isOpen && (
                <div className="w-full bg-white/50 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 mt-8 border-[6px] border-white/80 shadow-2xl flex flex-col gap-6 relative animate-fade-in-up">
                  <h3 className="text-2xl font-black text-slate-800 text-center mb-4">Activities & Lessons</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapter.chapters.sort((a, b) => a.order - b.order).map((subtopic, subIdx) => (
                    <div key={subtopic.id} className="bg-white rounded-[2rem] p-5 shadow-md border-2 border-slate-100 flex flex-col gap-4 bouncy-hover">
                      
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex shrink-0 items-center justify-center text-slate-500 font-black text-xl shadow-inner border border-slate-200">
                          {subIdx + 1}
                        </div>
                        <h4 className="text-md font-bold text-slate-700 leading-tight">{subtopic.title}</h4>
                      </div>

                      {/* Pure Icon Action Buttons inside squishy containers */}
                      <div className="flex gap-3 mt-auto">
                        <button 
                          onClick={() => handleActionClick("video", `sub-${subtopic.id}`)}
                          className="flex-1 relative group"
                          title="Watch Video"
                        >
                           <div className="absolute inset-0 bg-rose-500 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-rose-400 border-2 border-rose-200 rounded-[1.5rem] py-3 flex items-center justify-center text-3xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `video-sub-${subtopic.id}` ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             🎬
                           </div>
                        </button>
                        <button 
                          onClick={() => handleActionClick("notes", `sub-${subtopic.id}`)}
                          className="flex-1 relative group"
                          title="Read Notes"
                        >
                           <div className="absolute inset-0 bg-emerald-600 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-emerald-500 border-2 border-emerald-300 rounded-[1.5rem] py-3 flex items-center justify-center text-3xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `notes-sub-${subtopic.id}` ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             📝
                           </div>
                        </button>
                        <button 
                          onClick={() => handleActionClick("practice", `mock-quiz-1`)}
                          className="flex-1 relative group"
                          title="Practice Quiz"
                        >
                           <div className="absolute inset-0 bg-amber-600 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-amber-400 border-2 border-amber-200 rounded-[1.5rem] py-3 flex items-center justify-center text-3xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `practice-mock-quiz-1` ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             🎯
                           </div>
                        </button>
                      </div>

                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
      </div>
    </main>
  );
}
