import { useState, useEffect } from "react";
import { Subject, CONTENT_TYPE_INFO, ContentItem, VideoLecture, ChapterNotes, Quiz, FormulaSheet } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import UniversalBackground from "./UniversalBackground";
import { useUniversalTheme } from "../hooks/useUniversalTheme";

// Rose/mauve accents matching logo palette
const THEME_ACCENTS: Record<string, { lightBg: string; lightText: string }> = {
  math: { lightBg: "bg-rose-50", lightText: "text-rose-600" },
  science: { lightBg: "bg-emerald-50", lightText: "text-emerald-600" },
  english: { lightBg: "bg-purple-50", lightText: "text-purple-600" },
  social: { lightBg: "bg-amber-50", lightText: "text-amber-600" },
  logic: { lightBg: "bg-fuchsia-50", lightText: "text-fuchsia-600" },
  tech: { lightBg: "bg-cyan-50", lightText: "text-cyan-600" },
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
  const { backgroundClass, textClass } = useUniversalTheme();

  const theme = THEME_ACCENTS[subject.id] || { lightBg: "bg-slate-100", lightText: "text-slate-600" };

  const defaultSemNum = 10;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject.semesters[0];
  const allChapters = activeSemester?.chapters?.sort((a, b) => a.order - b.order) || [];

  const getContentTitle = (item: ContentItem): string => {
    switch (item.type) {
      case "video": return app.videos.find((v: VideoLecture) => v.id === item.refId)?.title || "Untitled Video";
      case "quiz": case "test": return app.quizzes.find((q: Quiz) => q.id === item.refId)?.title || "Untitled Quiz";
      case "notes": return app.chapterNotes.find((n: ChapterNotes) => n.id === item.refId)?.title || "Untitled Notes";
      case "formula-sheet": return app.formulaSheets.find((f: FormulaSheet) => f.id === item.refId)?.title || "Untitled";
      default: return "Unknown";
    }
  };

  const handleContentClick = (item: ContentItem) => {
    switch (item.type) {
      case "video": router.push(`/learn/video/${item.refId}`); break;
      case "notes": router.push(`/learn/notes/${item.refId}`); break;
      case "quiz": case "test": router.push(`/learn/quiz/${item.refId}`); break;
      default: break;
    }
  };

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

  const handleChapterToggle = (chapterId: string) => {
    setActiveChapter(prev => prev === chapterId ? null : chapterId);
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} selection:bg-rose-500/30 font-sans relative transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
      {/* Breadcrumb Header */}
      <header className="sticky top-0 z-40 bg-white/80 border-slate-200 backdrop-blur-md border-b py-3 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Saral School" className="w-8 h-8 object-contain drop-shadow-sm rounded-lg bg-white p-0.5" />
          <div className="flex items-center gap-3 text-xs font-medium">
             <button onClick={() => router.back()} className="flex items-center gap-1 transition-colors text-slate-500 hover:text-slate-900">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Dashboard
             </button>
             <span className="text-slate-400">/</span>
             <span className={theme.lightText}>{subject.name}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center rounded-lg border text-xs border-slate-200 bg-slate-50">
             <button 
               onClick={() => setViewMode("journey")} 
               className={`px-3 py-1.5 rounded-l-lg font-semibold transition-all ${viewMode === 'journey' ? 'bg-rose-100 text-rose-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Journey
             </button>
             <button 
               onClick={() => setViewMode("browse")} 
               className={`px-3 py-1.5 rounded-r-lg font-semibold transition-all ${viewMode === 'browse' ? 'bg-rose-100 text-rose-700' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Browse
             </button>
           </div>
           <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Progress</span>
              <span className="font-mono text-slate-900">32%</span>
           </div>
           <button onClick={() => setIsCommandPaletteOpen(true)} className="hidden sm:flex items-center gap-2 text-xs transition-colors rounded border px-2 py-1 text-slate-500 hover:text-slate-900 bg-white border-slate-200 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <kbd className="font-mono">Ctrl+K</kbd>
           </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        
        {/* Subject Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg ${theme.lightBg} border border-slate-200 flex items-center justify-center text-2xl`}>
               {subject.icon}
            </div>
            <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-slate-900">{subject.name}</h1>
          </div>
          <p className="text-sm max-w-2xl leading-relaxed text-slate-500">
            {allChapters.length} chapters available. Click any chapter to expand its content.
          </p>
        </div>

        {/* Chapter Accordions */}
        <div className="space-y-3">
          {allChapters.map((chapter, idx) => {
            const isOpen = activeChapter === chapter.id;
            const contentItems = [...chapter.contentItems].sort((a, b) => a.order - b.order);

            return (
              <div key={chapter.id} className="border rounded-xl overflow-hidden transition-all duration-300 border-slate-200 bg-white shadow-sm">
                
                <button 
                  onClick={() => handleChapterToggle(chapter.id)}
                  className="w-full flex items-center justify-between p-5 transition-colors text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono w-6 text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                     <h2 className={`font-medium transition-colors ${isOpen ? 'text-rose-600' : 'text-slate-700'}`}>{chapter.title}</h2>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-400">
                     <span className="hidden sm:inline-block border rounded px-2 py-0.5 border-slate-200 bg-slate-50">{contentItems.length} items</span>
                     <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rose-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>

                <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] border-t border-slate-100' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden min-h-0">

                    {viewMode === "journey" && contentItems.length > 0 ? (
                      <div className="relative pl-6">
                        <div className="absolute left-[18px] top-4 bottom-4 w-px bg-slate-200" />
                        
                        {contentItems.map((item, itemIdx) => {
                          const info = CONTENT_TYPE_INFO[item.type];
                          return (
                            <div key={item.id} className="mb-3 relative">
                              <div className="absolute left-[-14px] top-4 w-2.5 h-2.5 rounded-full z-10 ring-4 bg-rose-500 ring-white" />
                              <button
                                onClick={() => handleContentClick(item)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md"
                              >
                                <span className="text-xs font-mono w-5 text-center text-slate-400">{itemIdx + 1}</span>
                                <span className="text-lg">{info?.icon || '📄'}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate transition-colors text-slate-700 group-hover:text-rose-700">
                                    {getContentTitle(item)}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-wider text-slate-400">{info?.label || item.type}</p>
                                </div>
                                <span className="text-xs font-medium transition-colors text-slate-400 group-hover:text-rose-600">Start →</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : viewMode === "browse" && contentItems.length > 0 ? (
                      <>
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider font-semibold border-b mb-2 text-slate-400 border-slate-200">
                           <div className="col-span-1">#</div>
                           <div className="col-span-8">Content</div>
                           <div className="col-span-3 text-right">Action</div>
                        </div>

                        {contentItems.map((item, sIdx) => {
                          const info = CONTENT_TYPE_INFO[item.type];
                          return (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg transition-colors group cursor-default hover:bg-white shadow-sm hover:shadow-md border border-transparent hover:border-slate-200">
                              <div className="col-span-1 text-xs font-mono w-6 text-slate-400">
                                {sIdx + 1}
                              </div>
                              <div className="col-span-8 flex items-center gap-2">
                                <span className="text-sm">{info?.icon || '📄'}</span>
                                <h3 className="text-sm font-medium transition-colors text-slate-700 group-hover:text-slate-900">{getContentTitle(item)}</h3>
                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">{info?.label || item.type}</span>
                              </div>
                              <div className="col-span-3 flex justify-end">
                                <button 
                                  onClick={() => handleContentClick(item)} 
                                  className="px-3 py-1 border text-xs rounded transition-colors flex items-center gap-1 bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700"
                                >
                                  Open
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">No content uploaded yet. Ask your admin to add videos and notes!</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {allChapters.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg font-bold">No chapters available</p>
            <p className="text-sm">Ask your admin to add content for this subject.</p>
          </div>
        )}
      </div>

      {/* COMMAND PALETTE */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-xl border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 bg-white border-slate-200">
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Search chapters, notes, or run a test..." 
                className="flex-1 bg-transparent text-sm focus:outline-none text-slate-900 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono border rounded border-slate-200 bg-slate-100 text-slate-500">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto px-2 py-2">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-400">Quick Actions</p>
              
              <button 
                onClick={() => { setIsCommandPaletteOpen(false); onAction("practice", "mock-quiz-1"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group hover:bg-rose-50"
              >
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs border transition-colors bg-rose-100 text-rose-600 border-rose-200 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600">⚡</div>
                <span className="text-sm font-medium transition-colors text-slate-700 group-hover:text-rose-700">Run Full Subject Diagnostic</span>
              </button>

              <button 
                onClick={() => { setIsCommandPaletteOpen(false); router.push("/learn/profile"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group mt-1 hover:bg-slate-100"
              >
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs border transition-colors bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-200 group-hover:text-slate-700">⚙️</div>
                <span className="text-sm font-medium transition-colors text-slate-700 group-hover:text-slate-900">Open Workspace Settings</span>
              </button>
            </div>
            <div className="absolute inset-0 -z-10" onClick={() => setIsCommandPaletteOpen(false)}></div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
