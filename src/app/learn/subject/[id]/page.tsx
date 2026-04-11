"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { useGamification } from "../../contexts/GamificationContext";
import TopProfileBar from "../../components/TopProfileBar";
import KidsSubjectView from "../../components/KidsSubjectView";
import ExplorerSubjectView from "../../components/ExplorerSubjectView";
import ScholarSubjectView from "../../components/ScholarSubjectView";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";

export default function SubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.id as string;
  const { getSubjectById } = useApp();
  const { currentUser } = useAuth();
  const { currentStreak } = useGamification();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();
  
  const subject = getSubjectById(subjectId);

  // Directly open the first chapter by default
  const defaultSemNum = currentUser?.ageGroup === "scholar" ? 11 : currentUser?.ageGroup === "explorer" ? 5 : 1;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject?.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject?.semesters[0];
  const chapters = activeSemester?.chapters || [];

  const [openChapter, setOpenChapter] = useState<string | null>(chapters[0]?.id || null);

  if (!subject) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-pink-50">
        <span className="text-7xl mb-6 animate-bounce">😢</span>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Subject Not Found</h1>
        <button onClick={() => router.back()} className="px-8 py-4 bg-indigo-600 text-white rounded-3xl font-bold shadow-lg bouncy-hover">
          Let's Go Back!
        </button>
      </main>
    );
  }

  const handleAction = (type: "video" | "notes" | "practice", id: string) => {
    if (type === "video") router.push(`/learn/video/${id}`);
    else if (type === "practice") router.push(`/learn/quiz/${id}`);
    else if (type === "notes") {
      let noteId = null;
      for (const sem of subject.semesters) {
        const targetChapter = sem.chapters.find(c => `sub-${c.id}` === id || c.id === id || `ch-${sem.id}` === id);
        if (targetChapter) {
          const noteItem = targetChapter.contentItems.find(ci => ci.type === "notes");
          if (noteItem) noteId = noteItem.refId;
          break;
        }
      }
      if (noteId) {
        router.push(`/learn/notes/${noteId}`);
      } else {
        alert("Ask your teacher to upload notes for this chapter!");
      }
    }
  };

  if (currentUser?.ageGroup === "kids") {
    return <KidsSubjectView subject={subject} onAction={handleAction} router={router} currentUser={currentUser} />;
  }

  if (currentUser?.ageGroup === "explorer") {
    return <ExplorerSubjectView subject={subject} onAction={handleAction} router={router} currentStreak={currentStreak} currentUser={currentUser} />;
  }

  if (currentUser?.ageGroup === "scholar") {
    return <ScholarSubjectView subject={subject} onAction={handleAction} router={router} />;
  }

  // Gamified colors for chapters
  const bgColors = ["bg-amber-100", "bg-emerald-100", "bg-pink-100", "bg-indigo-100", "bg-violet-100", "bg-cyan-100"];
  const borderColors = ["border-amber-300", "border-emerald-300", "border-pink-300", "border-indigo-300", "border-violet-300", "border-cyan-300"];
  const textColors = ["text-amber-800", "text-emerald-800", "text-pink-800", "text-indigo-800", "text-violet-800", "text-cyan-800"];
  const hoverBorderColors = ["hover:border-amber-400", "hover:border-emerald-400", "hover:border-pink-400", "hover:border-indigo-400", "hover:border-violet-400", "hover:border-cyan-400"];

  const handleChapterToggle = (chapterId: string) => {
    setOpenChapter(prev => prev === chapterId ? null : chapterId);
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-x-hidden relative pb-32 transition-colors duration-200`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
      {/* Header Bar */}
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b p-4 flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200/50'}`}>
        <button onClick={() => router.back()} className={`w-12 h-12 rounded-2xl shadow-sm border-2 flex items-center justify-center text-xl font-bold bouncy-hover ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-700'}`}>
          ←
        </button>
        <TopProfileBar />
      </div>

      {/* Subject Hero Card */}
      <div className="px-6 pt-8 pb-8 max-w-2xl mx-auto">
        <div className={`rounded-[2rem] p-8 shadow-xl border-4 relative text-center overflow-hidden bouncy-hover ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-indigo-50'}`}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full opacity-30"></div>
          
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner border-4 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-gradient-to-br from-indigo-100 to-indigo-50 border-white'}`}>
              {subject.icon}
            </div>
            <h1 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{subject.name}</h1>
            
            <div className="flex items-center gap-3 mt-4">
              <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                <span>📖</span> {chapters.length} Chapters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Accordion List */}
      <div className="max-w-2xl mx-auto px-6 relative">
        <div className="space-y-4">
          {chapters.sort((a, b) => a.order - b.order).map((chapter, chIdx) => {
            const isOpen = openChapter === chapter.id;
            const colorIdx = chIdx % bgColors.length;
            const bgClass = bgColors[colorIdx];
            const borderClass = borderColors[colorIdx];
            const textColor = textColors[colorIdx];
            const hoverClass = hoverBorderColors[colorIdx];

            return (
              <div key={chapter.id} className="relative">
                <div className={`rounded-[2rem] border-4 shadow-sm transition-colors duration-150 overflow-hidden ${isOpen ? borderClass : isDark ? 'border-white/10' : 'border-slate-100'} ${isDark ? 'bg-slate-900/80' : 'bg-white'}`}>
                  
                  {/* Chapter Header — Always visible, click to toggle */}
                  <div
                    className={`p-5 cursor-pointer select-none transition-colors duration-150 ${isOpen ? (isDark ? 'bg-white/5' : bgClass.replace('100', '50')) : ''}`}
                    onClick={() => handleChapterToggle(chapter.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-lg font-black border-2 ${bgClass} ${borderClass} ${textColor}`}>
                          {chIdx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold mb-0.5 uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Chapter {chIdx + 1}</p>
                          <h3 className={`text-lg md:text-xl font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{chapter.title}</h3>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'bg-white/5' : bgClass}`}>
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content — grid-rows trick for instant animation */}
                  <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden min-h-0">
                      
                      {/* Quick Chapter Actions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button onClick={() => handleAction("video", `ch-${activeSemester!.id}`)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                          <span className="text-lg">🎬</span> Watch
                        </button>
                        <button onClick={() => handleAction("notes", chapter.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                          <span className="text-lg">📝</span> Notes
                        </button>
                        <button onClick={() => handleAction("practice", `mock-quiz-1`)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors border ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'}`}>
                          <span className="text-lg">🎯</span> Practice
                        </button>
                      </div>

                      {/* Subtopics */}
                      {chapter.contentItems && chapter.contentItems.length > 0 ? (
                        chapter.contentItems.sort((a, b) => a.order - b.order).map((item, subIdx) => (
                          <div key={item.id} className={`rounded-2xl p-4 border-2 transition-colors ${hoverClass} ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                {subIdx + 1}
                              </div>
                              <span className={`flex-1 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.type === "video" ? "🎬" : item.type === "notes" ? "📝" : item.type === "quiz" || item.type === "test" ? "🎯" : "📄"} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                              <button onClick={() => {
                                if (item.type === "video") router.push(`/learn/video/${item.refId}`);
                                else if (item.type === "notes") router.push(`/learn/notes/${item.refId}`);
                                else if (item.type === "quiz" || item.type === "test") router.push(`/learn/quiz/${item.refId}`);
                              }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isDark ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                                Open →
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          No content uploaded yet for this chapter.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {chapters.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="text-5xl block mb-4">📚</span>
            <p className="text-lg font-bold">No chapters available yet</p>
            <p className="text-sm">Ask your admin to add content for this subject.</p>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
