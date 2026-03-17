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
  const { backgroundClass, textClass } = useUniversalTheme();
  
  const subject = getSubjectById(subjectId);

  // Track which Chapter (previously Semesters) is open
  const initialChapter = subject?.semesters.find(s => s.chapters.length > 0)?.id || null;
  const [openChapter, setOpenChapter] = useState<string | null>(initialChapter);

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

  // Find active semester
  const defaultSemNum = currentUser?.ageGroup === "scholar" ? 11 : currentUser?.ageGroup === "explorer" ? 5 : 1;
  const targetSemNum = currentUser?.assignedSemester || defaultSemNum;
  const activeSemester = subject.semesters.find(s => s.id === `${subject.id}-sem-${targetSemNum}`) || subject.semesters[0];
  const semestersToDisplay = activeSemester ? [activeSemester] : [];

  // Count total subtopics for just this semester
  const totalSubtopics = semestersToDisplay.reduce((sum, sem) => sum + sem.chapters.length, 0);

  // Gamified colors for Chapters
  const bgColors = ["bg-amber-100", "bg-emerald-100", "bg-pink-100", "bg-indigo-100"];
  const borderColors = ["border-amber-300", "border-emerald-300", "border-pink-300", "border-indigo-300"];
  const textColors = ["text-amber-800", "text-emerald-800", "text-pink-800", "text-indigo-800"];
  const shadowColors = ["shadow-amber-200", "shadow-emerald-200", "shadow-pink-200", "shadow-indigo-200"];
  const hoverBorderColors = ["hover:border-amber-400", "hover:border-emerald-400", "hover:border-pink-400", "hover:border-indigo-400"];

  const handleAction = (type: "video" | "notes" | "practice", id: string) => {
    if (type === "video") router.push(`/learn/video/${id}`);
    else if (type === "practice") router.push(`/learn/quiz/${id}`);
    else if (type === "notes") {
      // TODO: Notes viewer route
      alert("Notes viewer coming soon!");
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

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} overflow-x-hidden relative pb-32 transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 p-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="w-12 h-12 bg-white rounded-2xl shadow-sm border-2 border-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 bouncy-hover">
          ←
        </button>
        <TopProfileBar />
      </div>

      {/* Subject Hero Card */}
      <div className="px-6 pt-8 pb-12 max-w-2xl mx-auto">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-indigo-50 relative text-center overflow-hidden bouncy-hover">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full opacity-50"></div>
          
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner border-4 border-white">
              {subject.icon}
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">{subject.name}</h1>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 flex items-center gap-2">
                <span>📚</span> {semestersToDisplay.filter(s => s.chapters.length > 0).length} Regions
              </div>
              <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 flex items-center gap-2">
                <span>🔖</span> {totalSubtopics} Topics
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Chapters List */}
      <div className="max-w-2xl mx-auto px-6 relative">
        <div className="space-y-6">
          {semestersToDisplay.filter(s => s.chapters.length > 0).map((semester, semIdx) => {
            const isOpen = openChapter === semester.id;
            
            const colorIdx = semIdx % bgColors.length;
            const bgClass = bgColors[colorIdx];
            const borderClass = borderColors[colorIdx];
            const textClass = textColors[colorIdx];
            const shadowClass = shadowColors[colorIdx];
            const hoverClass = hoverBorderColors[colorIdx];

            return (
              <div key={semester.id} className="relative">
                {/* Chapter Container (Previously Semester) */}
                <div className={`bg-white rounded-[2rem] border-4 ${isOpen ? borderClass : 'border-slate-100'} shadow-sm transition-all overflow-hidden`}>
                  
                  {/* Chapter Header */}
                  <div className={`p-6 ${isOpen ? bgClass.replace('100', '50') : ''}`}>
                    <div 
                      className="flex justify-between items-start cursor-pointer"
                      onClick={() => setOpenChapter(isOpen ? null : semester.id)}
                    >
                      <div className="flex gap-4">
                        <div className={`w-14 h-14 shrink-0 ${bgClass} rounded-2xl flex items-center justify-center text-xl font-black border-2 ${borderClass} ${textClass}`}>
                          {semIdx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Chapter {semIdx + 1}</p>
                          <h3 className={`text-2xl font-black text-slate-900 leading-tight`}>{semester.title}</h3>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center text-xl shrink-0`}>
                        {isOpen ? "🔽" : "▶️"}
                      </div>
                    </div>

                    {/* Quick actions for the ENTIRE chapter (User Request: "and similar should be after name of each chapter") */}
                    {isOpen && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        <button onClick={() => handleAction("video", `ch-${semester.id}`)} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm transition-colors border border-indigo-200">
                          <span className="text-lg">🎬</span> Watch Chapter
                        </button>
                        <button onClick={() => handleAction("notes", `ch-${semester.id}`)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm transition-colors border border-emerald-200">
                          <span className="text-lg">📝</span> Chapter Notes
                        </button>
                        <button onClick={() => handleAction("practice", `mock-quiz-1`)} className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-bold text-sm transition-colors border border-amber-200">
                          <span className="text-lg">🎯</span> Chapter Practice
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subtopics List (Previously Chapters) */}
                  {isOpen && (
                    <div className="p-4 pt-0 space-y-3">
                      <div className="w-full h-px bg-slate-100 mb-4"></div>
                      
                      {semester.chapters.sort((a, b) => a.order - b.order).map((subtopic, subIdx) => (
                        <div key={subtopic.id} className={`bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 bouncy-hover ${hoverClass} transition-colors`}>
                          
                          {/* Subtopic Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shrink-0 mt-0.5">
                              {subIdx + 1}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 leading-tight">{subtopic.title}</h4>
                          </div>

                          {/* Quick actions for the Subtopic (User Request: "below the name of each subtopic there will be option for notes vidwo lecture and practice") */}
                          <div className="flex flex-wrap gap-2 ml-11">
                            <button 
                              onClick={() => handleAction("video", `sub-${subtopic.id}`)} 
                              className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                            >
                              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎬</span>
                              <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-700">Video</span>
                            </button>

                            <button 
                              onClick={() => handleAction("notes", `sub-${subtopic.id}`)} 
                              className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                            >
                              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📝</span>
                              <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">Notes</span>
                            </button>

                            <button 
                              onClick={() => handleAction("practice", `mock-quiz-1`)} 
                              className="flex-1 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition-all group"
                            >
                              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎯</span>
                              <span className="text-xs font-bold text-slate-600 group-hover:text-amber-700">Practice</span>
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </main>
  );
}
