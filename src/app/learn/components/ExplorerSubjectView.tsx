import { useState } from "react";
import { Subject } from "../types";
import TopProfileBar from "./TopProfileBar";
import UniversalBackground from "./UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Hyper-Gradients for the 'Adventure/Gamer' aesthetic
const THEME_GRADIENTS: Record<string, string> = {
  math: "from-blue-600 via-indigo-600 to-purple-700",
  science: "from-emerald-500 via-teal-500 to-cyan-600",
  english: "from-rose-500 via-pink-600 to-purple-600",
  social: "from-amber-500 via-orange-500 to-red-600",
  logic: "from-violet-600 via-purple-600 to-fuchsia-700",
  tech: "from-cyan-500 via-sky-600 to-blue-700",
};

export default function ExplorerSubjectView({
  subject,
  onAction,
  router,
  currentStreak,
  currentUser,
}: {
  subject: Subject;
  onAction: (type: "video" | "notes" | "practice", id: string) => void;
  router: any;
  currentStreak: number;
  currentUser: import("../types").User | null;
}) {
  // FIND THE ACTIVE SEMESTER
  const defaultSemNum = currentUser?.ageGroup === "scholar" ? 11 : currentUser?.ageGroup === "explorer" ? 5 : 1;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject.semesters[0];
  const semestersToDisplay = activeSemester ? [activeSemester] : [];

  const initialChapter = semestersToDisplay.find(s => s.chapters.length > 0)?.id || null;
  const [activeChapter, setActiveChapter] = useState<string | null>(initialChapter);

  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const primaryGradient = THEME_GRADIENTS[subject.id] || "from-slate-600 to-slate-800";

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-x-hidden relative pb-32 font-sans transition-colors duration-1000`}>
      {/* Decorative Background */}
      {isDark ? (
        <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
          <div className={`absolute top-0 right-0 w-[60vw] h-[60vw] bg-gradient-to-bl ${primaryGradient} rounded-full blur-[150px]`} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <div className={`absolute top-0 right-0 w-[60vw] h-[60vw] bg-gradient-to-bl ${primaryGradient} rounded-full blur-[120px]`} />
        </div>
      )}

      {/* Header Bar */}
      <div className={`sticky top-0 z-50 ${isDark ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10' : 'bg-white/80 backdrop-blur-md border-b border-slate-200'} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm transition-transform hover:-translate-x-1 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-50 border border-slate-200'}`}
          >
            ←
          </button>
          <img src="/logo.png" alt="Saral School" className="w-10 h-10 object-contain drop-shadow-sm rounded-lg bg-white p-1" />
        </div>
        <TopProfileBar />
      </div>

      <div className="w-full max-w-7xl mx-auto flex gap-12 px-6 relative z-10">
        
        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-5xl mx-auto xl:mx-0">
          
          {/* Subject Hero Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-12 border-b border-dashed border-white/20 mb-12">
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${primaryGradient} flex items-center justify-center text-7xl shadow-2xl relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-10 group-hover:bg-white/10 transition-colors"></div>
            <span className="relative z-20 group-hover:scale-110 transition-transform duration-500 delay-75">{subject.icon}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-md">{subject.name}</h1>
            <p className={`text-lg md:text-xl font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Complete stages to unlock exclusive profile badges.</p>
            
            <div className={`mt-6 inline-flex gap-4 p-2 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-black/5'}`}>
               <div className="flex items-center gap-2 px-4 py-2">
                 <span className="opacity-50 text-xl">🗺️</span>
                 <span className="font-bold">{semestersToDisplay.filter(s => s.chapters.length > 0).length} Regions</span>
               </div>
               <div className="w-px bg-white/10"></div>
               <div className="flex items-center gap-2 px-4 py-2">
                 <span className="opacity-50 text-xl">⚔️</span>
                 <span className="font-bold">{semestersToDisplay.reduce((sum, sem) => sum + sem.chapters.length, 0)} Stages</span>
               </div>
            </div>
          </div>
        </div>

        {/* Chapters as Collectible Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {semestersToDisplay.filter(s => s.chapters.length > 0).map((chapter, chapIdx) => {
            const isOpen = activeChapter === chapter.id;

            return (
              <div key={chapter.id} className="relative group perspective">
                
                {/* The Collectible Trading Card */}
                <button
                  onClick={() => setActiveChapter(isOpen ? null : chapter.id)}
                  className={`w-full text-left relative z-20 transition-all duration-500 ease-out transform-style-3d ${isOpen ? 'scale-105 -translate-y-2' : 'hover:-translate-y-2 hover:scale-[1.02]'} shadow-2xl rounded-3xl overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-800 to-slate-900 border border-white/10' : 'from-white to-slate-50 border border-slate-200'}`}></div>
                  
                  {/* Holographic Foil Top Half */}
                  <div className={`h-32 bg-gradient-to-br ${primaryGradient} relative overflow-hidden p-6 flex flex-col justify-between`}>
                     {/* Glossy Slash */}
                     <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-white/20 skew-x-[-20deg] translate-x-10 group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                     
                     <div className="flex justify-between items-start relative z-10">
                        <div className="bg-black/30 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                          Region {chapIdx + 1}
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          🔽
                        </div>
                     </div>

                     <h3 className="text-2xl font-black text-white relative z-10 drop-shadow-md leading-tight">{chapter.title}</h3>
                  </div>

                  {/* Card Bottom Half (Stats) */}
                  <div className="p-6 relative z-10">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stages</span>
                           <span className={`text-lg font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{chapter.chapters.length}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reward</span>
                           <span className="text-lg font-black text-amber-400">💎 {(chapIdx + 1) * 50}</span>
                        </div>
                     </div>
                  </div>
                </button>

                {/* The Dropdown Panel (Slides out from underneath the card) */}
                {isOpen && (
                  <div className={`absolute left-0 right-0 top-[90%] z-10 pt-10 pb-4 px-2 rounded-b-[2.5rem] ${isDark ? 'bg-slate-800/90 border border-t-0 border-white/10 shadow-black/50' : 'bg-slate-50/90 border border-t-0 border-slate-200 shadow-slate-200'} backdrop-blur-xl shadow-2xl animate-slide-down origin-top`}>
                    
                    {/* ENTIRE CHAPTER ACTIONS */}
                    <div className="flex gap-2 p-2 mx-2 mb-4">
                      <button onClick={() => onAction("video", `ch-${chapter.id}`)} className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                        🎬 View All 
                      </button>
                      <button onClick={() => onAction("practice", `mock-quiz-1`)} className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                        ⚔️ Boss Fight
                      </button>
                    </div>

                    <div className="space-y-2 px-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
                      {chapter.chapters.sort((a, b) => a.order - b.order).map((subtopic, subIdx) => (
                        <div key={subtopic.id} className={`group/item p-4 rounded-2xl transition-colors ${isDark ? 'hover:bg-white/5 border border-transparent hover:border-white/10' : 'hover:bg-white shadow-sm hover:shadow-md border border-slate-100 hover:border-slate-200'} cursor-pointer`}>
                          
                          <div className="flex items-center gap-3 mb-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                               {subIdx + 1}
                             </div>
                             <h4 className={`font-bold line-clamp-2 leading-tight flex-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{subtopic.title}</h4>
                          </div>

                          {/* Quick Action Pills */}
                          <div className="flex gap-2 ml-11">
                            <button onClick={(e) => { e.stopPropagation(); onAction("video", `sub-${subtopic.id}`); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 ${isDark ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                              🎬 Video
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onAction("notes", `sub-${subtopic.id}`); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 ${isDark ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                              📝 Notes
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onAction("practice", `mock-quiz-1`); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 ${isDark ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/40' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                              ⚔️ Quest
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

      <style jsx global>{`
        @keyframes slide-down {
          0% { opacity: 0; transform: scaleY(0.95) translateY(-20px); }
          100% { opacity: 1; transform: scaleY(1) translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .perspective {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
