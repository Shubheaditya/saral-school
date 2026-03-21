import { useState, useEffect } from "react";
import { Subject, CONTENT_TYPE_INFO, ContentItem, VideoLecture, ChapterNotes, Quiz, FormulaSheet } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import UniversalBackground from "./UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Deep, muted tech accents
const THEME_ACCENTS: Record<string, { bg: string; text: string; ring: string; lightBg: string; lightText: string }> = {
  math: { bg: "bg-blue-500/10", text: "text-blue-400", ring: "ring-blue-500/30", lightBg: "bg-blue-50", lightText: "text-blue-600" },
  science: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", lightBg: "bg-emerald-50", lightText: "text-emerald-600" },
  english: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/30", lightBg: "bg-violet-50", lightText: "text-violet-600" },
  social: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30", lightBg: "bg-amber-50", lightText: "text-amber-600" },
  logic: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", ring: "ring-fuchsia-500/30", lightBg: "bg-fuchsia-50", lightText: "text-fuchsia-600" },
  tech: { bg: "bg-cyan-500/10", text: "text-cyan-400", ring: "ring-cyan-500/30", lightBg: "bg-cyan-50", lightText: "text-cyan-600" },
};

export default function ScholarSubjectView({
  subject,
  onAction,
  router,
}: {
  subject: Subject;
  onAction: (type: "video" | "notes" | "practice", id: string) => void;
  router: any;
}) {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"journey" | "browse">("journey");
  const { currentUser } = useAuth();
  const app = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const theme = THEME_ACCENTS[subject.id] || { bg: "bg-slate-800/50", text: "text-slate-400", ring: "ring-slate-700", lightBg: "bg-slate-100", lightText: "text-slate-600" };
  // FIND THE ACTIVE SEMESTER
  const defaultSemNum = currentUser?.ageGroup === "scholar" ? 11 : currentUser?.ageGroup === "explorer" ? 5 : 1;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject.semesters[0];
  const semestersToDisplay = activeSemester ? [activeSemester] : [];
  const chapters = semestersToDisplay.filter(s => s.chapters.length > 0);
  const totalSubtopics = chapters.reduce((sum, ch) => sum + ch.chapters.length, 0);

  // Resolve content item title
  const getContentTitle = (item: ContentItem): string => {
    switch (item.type) {
      case "video": return app.videos.find((v: VideoLecture) => v.id === item.refId)?.title || "Untitled Video";
      case "quiz": case "test": return app.quizzes.find((q: Quiz) => q.id === item.refId)?.title || "Untitled Quiz";
      case "notes": return app.chapterNotes.find((n: ChapterNotes) => n.id === item.refId)?.title || "Untitled Notes";
      case "formula-sheet": return app.formulaSheets.find((f: FormulaSheet) => f.id === item.refId)?.title || "Untitled";
      default: return "Unknown";
    }
  };

  // Route to the correct content viewer
  const handleContentClick = (item: ContentItem) => {
    switch (item.type) {
      case "video": router.push(`/learn/video/${item.refId}`); break;
      case "notes": router.push(`/learn/notes/${item.refId}`); break;
      case "quiz": case "test": router.push(`/learn/quiz/${item.refId}`); break;
      default: break;
    }
  };

  // Fake Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(open => !open);
      }
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} selection:bg-indigo-500/30 font-sans relative transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
      {/* Zen Breadcrumb Header */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-[#0A0A0A]/80 border-white/5' : 'bg-white/80 border-slate-200'} backdrop-blur-md border-b py-3 px-6 lg:px-12 flex items-center justify-between transition-colors duration-500`}>
        <div className="flex items-center gap-3 text-xs font-medium">
           <button onClick={() => router.back()} className={`flex items-center gap-1 transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Dashboard
           </button>
           <span className="text-slate-400">/</span>
           <span className={isDark ? theme.text : theme.lightText}>{subject.name}</span>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Journey / Browse Mode Toggle */}
           <div className={`flex items-center rounded-lg border text-xs ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
             <button 
               onClick={() => setViewMode("journey")} 
               className={`px-3 py-1.5 rounded-l-lg font-semibold transition-all ${viewMode === 'journey' ? (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700') : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
             >
               🗺️ Journey
             </button>
             <button 
               onClick={() => setViewMode("browse")} 
               className={`px-3 py-1.5 rounded-r-lg font-semibold transition-all ${viewMode === 'browse' ? (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700') : (isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-700')}`}
             >
               📚 Browse
             </button>
           </div>
           {/* Simulate completion % */}
           <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Progress</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>32%</span>
           </div>
           <button onClick={() => setIsCommandPaletteOpen(true)} className={`hidden sm:flex items-center gap-2 text-xs transition-colors rounded border px-2 py-1 ${isDark ? 'text-slate-500 hover:text-white bg-white/5 border-white/5' : 'text-slate-500 hover:text-slate-900 bg-white border-slate-200 shadow-sm'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <kbd className="font-mono">⌘K</kbd>
           </button>
        </div>
      </header>

      {/* Main Content Area - Max width for readability like a prose document */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        
        {/* Minimal Subject Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg ${isDark ? theme.bg + ' border-white/10' : theme.lightBg + ' border-' + theme.lightBg.split('-')[1] + '-200'} border flex items-center justify-center text-2xl`}>
               {subject.icon}
            </div>
            <h1 className={`text-4xl lg:text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{subject.name}</h1>
          </div>
          <p className={`text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Master the core concepts of {subject.name.toLowerCase()} through {chapters.length} modules and {totalSubtopics} dense subtopics. 
            Assignments are verified automatically.
          </p>
        </div>

        {/* Modules List - Clean, highly structured table/grid hybrid */}
        <div className="space-y-6">
          {chapters.map((chapter, idx) => {
            const isOpen = activeChapter === chapter.id;

            return (
              <div key={chapter.id} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isDark ? 'border-white/5 bg-slate-900/20' : 'border-slate-200 bg-white shadow-sm'}`}>
                
                {/* Module Bar */}
                <button 
                  onClick={() => setActiveChapter(isOpen ? null : chapter.id)}
                  className={`w-full flex items-center justify-between p-5 transition-colors text-left ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-4">
                     <span className={`text-xs font-mono w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{(idx + 1).toString().padStart(2, '0')}</span>
                     <h2 className={`font-medium transition-colors ${isOpen ? (isDark ? 'text-white' : 'text-indigo-600') : (isDark ? 'text-slate-300' : 'text-slate-700')}`}>{chapter.title}</h2>
                  </div>
                  <div className={`flex items-center gap-6 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                     <span className={`hidden sm:inline-block border rounded px-2 py-0.5 ${isDark ? 'border-white/10' : 'border-slate-200 bg-slate-50'}`}>{chapter.chapters.length} topics</span>
                     <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? (isDark ? 'rotate-180 text-white' : 'rotate-180 text-indigo-600') : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>

                {/* Subtopics / Journey Content */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? `max-h-[2000px] border-t ${isDark ? 'border-white/5' : 'border-slate-100'}` : 'max-h-0'}`}>
                  <div className={`${isDark ? 'bg-black/20' : 'bg-slate-50/50'} p-2`}>

                    {viewMode === "journey" ? (
                      /* ===== JOURNEY MODE: Sequential Content Timeline ===== */
                      <div className="relative pl-6">
                        {/* Vertical timeline line */}
                        <div className={`absolute left-[18px] top-4 bottom-4 w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

                        {chapter.chapters.sort((a,b) => a.order - b.order).map((sub) => {
                          const contentItems = [...sub.contentItems].sort((a,b) => a.order - b.order);
                          if (contentItems.length === 0) return null;

                          return (
                            <div key={sub.id} className="mb-6">
                              {/* Subtopic Label */}
                              <div className="flex items-center gap-2 mb-3 ml-4">
                                <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'} relative z-10 ring-4 ${isDark ? 'ring-[#0A0A0A]' : 'ring-white'}`} />
                                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub.title}</span>
                              </div>

                              {/* Content Items in Order */}
                              <div className="space-y-2 ml-4">
                                {contentItems.map((item, itemIdx) => {
                                  const info = CONTENT_TYPE_INFO[item.type];
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => handleContentClick(item)}
                                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group ${isDark ? 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-indigo-500/30' : 'bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'}`}
                                    >
                                      <span className={`text-xs font-mono w-5 text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{itemIdx + 1}</span>
                                      <span className="text-lg">{info?.icon || '📄'}</span>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-700'}`}>
                                          {getContentTitle(item)}
                                        </p>
                                        <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{info?.label || item.type}</p>
                                      </div>
                                      <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-600 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>Start →</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {/* Empty state for Journey if no content items exist */}
                        {chapter.chapters.every(sub => sub.contentItems.length === 0) && (
                          <div className={`text-center py-8 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            <p className="text-sm">No content uploaded yet. Ask your admin to add videos and notes!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* ===== BROWSE MODE: Original Subtopic Grid ===== */
                      <>
                        {/* Header Row */}
                        <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider font-semibold border-b mb-2 ${isDark ? 'text-slate-600 border-white/5' : 'text-slate-400 border-slate-200'}`}>
                           <div className="col-span-1">ID</div>
                           <div className="col-span-8">Topic Name</div>
                           <div className="col-span-3 text-right">Actions</div>
                        </div>

                        {chapter.chapters.sort((a,b) => a.order - b.order).map((sub, sIdx) => (
                          <div key={sub.id} className={`grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg transition-colors group cursor-default ${isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-white shadow-sm hover:shadow-md border border-transparent hover:border-slate-200'}`}>
                            
                            <div className={`col-span-1 text-xs font-mono w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                              {idx + 1}.{sIdx + 1}
                            </div>
                            
                            <div className="col-span-8">
                              <h3 className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{sub.title}</h3>
                            </div>
                            
                            <div className="col-span-3 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button onClick={() => onAction("video", sub.id)} className={`px-2 py-1 border text-xs rounded transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`} title="Watch Lecture">
                                🎬
                              </button>
                              <button onClick={() => onAction("notes", sub.id)} className={`px-2 py-1 border text-xs rounded transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`} title="Read Notes">
                                📝
                              </button>
                              <button onClick={() => onAction("practice", sub.id)} className={`px-2 py-1 border text-xs rounded transition-colors flex items-center gap-1 ${isDark ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'}`} title="Execute Test">
                                ⚡ <span className="hidden lg:inline">Run</span>
                              </button>
                            </div>

                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* COMMAND PALETTE MODAL OVERLAY */}
      {isCommandPaletteOpen && (
        <div className={`fixed inset-0 z-50 flex items-start justify-center pt-[15vh] ${isDark ? 'bg-[#0A0A0A]/80 backdrop-blur-sm' : 'bg-slate-900/40 backdrop-blur-sm'}`}>
          <div className={`w-full max-w-xl border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            {/* Search Input */}
            <div className={`flex items-center px-4 py-3 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              <svg className={`w-5 h-5 mr-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search modules, notes, or run a test..." 
                className={`flex-1 bg-transparent text-sm focus:outline-none ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono border rounded ${isDark ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>ESC</kbd>
            </div>

            {/* Simulated Search Results */}
            <div className="max-h-80 overflow-y-auto px-2 py-2">
              <p className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Quick Actions</p>
              
              <button 
                onClick={() => { setIsCommandPaletteOpen(false); onAction("practice", "mock-quiz-1"); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group ${isDark ? 'hover:bg-indigo-500/10' : 'hover:bg-indigo-50'}`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-colors ${isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white' : 'bg-indigo-100 text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600'}`}>⚡</div>
                <span className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-indigo-700'}`}>Run Full Subject Diagnostic</span>
              </button>

              <button 
                onClick={() => { setIsCommandPaletteOpen(false); router.push("/learn/profile"); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group mt-1 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs border transition-colors ${isDark ? 'bg-slate-800 text-slate-400 border-white/5 group-hover:bg-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-200 group-hover:text-slate-700'}`}>⚙️</div>
                <span className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>Open Workspace Settings</span>
              </button>
            </div>
            {/* Overlay background click to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setIsCommandPaletteOpen(false)}></div>
          </div>
        </div>
      )}
      </div>    </main>
  );
}
