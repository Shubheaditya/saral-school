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
        <button 
          onClick={() => router.back()} 
          className="w-16 h-16 bg-white border-b-8 border-slate-200 rounded-full flex items-center justify-center text-3xl shadow-md active:border-b-0 active:translate-y-2 transition-all"
        >
          ⬅️
        </button>
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

      <div className="max-w-md mx-auto px-6 relative space-y-12">
        {/* Winding Map of Chapters */}
        {semestersToDisplay.filter(s => s.chapters.length > 0).map((chapter, chapIdx) => {
          const color = EDIBLE_COLORS[chapIdx % EDIBLE_COLORS.length];
          const isOpen = activeChapter === chapter.id;

          return (
            <div key={chapter.id} className="relative flex flex-col items-center">
              {/* Path line to next chapter */}
              {chapIdx < semestersToDisplay.length - 1 && !isOpen && (
                <div className="absolute top-[110px] w-4 h-16 bg-white/60 rounded-full -z-10"></div>
              )}

              {/* Big Squishy Chapter Button */}
              <button
                onClick={() => setActiveChapter(isOpen ? null : chapter.id)}
                className="group relative transition-transform duration-300 w-full max-w-[280px]"
                style={{ transformOrigin: "center bottom" }}
              >
                <div className={`absolute inset-0 ${color.border} rounded-[3rem] top-3`}></div>
                <div className={`relative ${color.bg} border-4 border-white/40 rounded-[3rem] px-6 py-8 shadow-xl transform transition-transform duration-150 active:translate-y-3 flex items-center justify-center gap-4`}>
                    <div className="absolute top-2 left-6 right-6 h-4 bg-white/30 rounded-full blur-[2px]"></div>
                    <span className="text-6xl text-white font-black drop-shadow-md">{chapIdx + 1}</span>
                    <span className="text-4xl">{isOpen ? "🔽" : "▶️"}</span>
                </div>
              </button>

              {/* Opened Subtopics directly below */}
              {isOpen && (
                <div className="w-full bg-white/60 backdrop-blur-md rounded-[3rem] p-6 mt-6 border-4 border-white/80 shadow-inner flex flex-col gap-6 relative">
                  {chapter.chapters.sort((a, b) => a.order - b.order).map((subtopic, subIdx) => (
                    <div key={subtopic.id} className="bg-white rounded-[2rem] p-4 shadow-sm border-2 border-slate-100 flex flex-col gap-3">
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-xl">
                          {subIdx + 1}
                        </div>
                        {/* Notice we still have a title here for parental guidance, but the actions are purely icons */}
                        <h4 className="text-lg font-bold text-slate-700 leading-tight">{subtopic.title}</h4>
                      </div>

                      {/* Pure Icon Action Buttons inside squishy containers */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleActionClick("video", `sub-${subtopic.id}`)}
                          className="flex-1 relative group"
                        >
                           <div className="absolute inset-0 bg-indigo-500 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-indigo-400 border-2 border-indigo-200 rounded-[1.5rem] py-4 flex items-center justify-center text-4xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `video-sub-${subtopic.id}` ? 'scale-110' : ''}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             🎬
                           </div>
                        </button>
                        <button 
                          onClick={() => handleActionClick("notes", `sub-${subtopic.id}`)}
                          className="flex-1 relative group"
                        >
                           <div className="absolute inset-0 bg-emerald-600 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-emerald-500 border-2 border-emerald-300 rounded-[1.5rem] py-4 flex items-center justify-center text-4xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `notes-sub-${subtopic.id}` ? 'scale-110' : ''}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             📝
                           </div>
                        </button>
                        <button 
                          onClick={() => handleActionClick("practice", `mock-quiz-1`)}
                          className="flex-1 relative group"
                        >
                           <div className="absolute inset-0 bg-amber-500 rounded-[1.5rem] top-2"></div>
                           <div className={`relative bg-amber-400 border-2 border-amber-200 rounded-[1.5rem] py-4 flex items-center justify-center text-4xl transform transition-transform duration-100 active:translate-y-2 ${clickedItem === `practice-mock-quiz-1` ? 'scale-110' : ''}`}>
                             <div className="absolute top-1 left-3 right-3 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                             🎯
                           </div>
                        </button>
                      </div>

                    </div>
                  ))}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4 h-10 bg-white/60 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </main>
  );
}
