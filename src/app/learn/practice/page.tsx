"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import TopProfileBar from "../components/TopProfileBar";
import { User } from "../types";

export default function PracticePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { subjects, quizzes } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  if (!currentUser) {
    router.replace("/learn/login");
    return null;
  }

  // Type assertion for safety
  const user = currentUser as User;

  // Dynamic Theme Generation
  const isDark = user?.themePreference !== "light";
  
  const getTheme = () => {
    switch (user.ageGroup) {
      case "kids":
         return { bg: "bg-emerald-50", text: "text-emerald-900", card: "bg-white shadow-[0_4px_0_#a7f3d0]", border: "border-emerald-200", button: "bg-emerald-500 text-white shadow-[0_4px_0_#059669]", pillBg: "bg-white", pillActive: "bg-emerald-500 text-white shadow-[0_4px_0_#059669]", pillInactive: "text-slate-500 border-2 border-slate-100" };
      case "explorer":
         return { bg: "bg-slate-900", text: "text-white", card: "bg-slate-800/80 backdrop-blur border border-white/10 shadow-xl", border: "border-teal-500/50", button: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg", pillBg: "bg-slate-800", pillActive: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg", pillInactive: "text-slate-400 hover:text-white border border-white/10" };
      case "scholar":
      default:
         return { 
           bg: isDark ? "bg-[#0A0A0A]" : "bg-[#F8FAFC]", 
           text: isDark ? "text-slate-200" : "text-slate-900", 
           card: isDark ? "bg-slate-900/50 backdrop-blur-xl border border-white/10" : "bg-white shadow-sm border border-slate-200", 
           border: isDark ? "border-slate-700" : "border-slate-200",
           button: isDark ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" : "bg-slate-900 text-white hover:bg-slate-800",
           pillBg: isDark ? "bg-slate-900" : "bg-white",
           pillActive: isDark ? "bg-slate-800 text-white border border-slate-600" : "bg-slate-900 text-white shadow-sm",
           pillInactive: isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
         };
    }
  };

  const theme = getTheme();

  const filteredQuizzes = selectedSubject === "all"
    ? quizzes
    : quizzes.filter(q => q.subjectId === selectedSubject);

  const quizModes = [
    { mode: "quiz", label: "Quick Quizzes", icon: "📝", description: "Short, topic-specific quizzes", color: "bg-emerald-50 border-emerald-200" },
    { mode: "chapter-test", label: "Chapter Tests", icon: "📋", description: "Full chapter assessments", color: "bg-indigo-50 border-indigo-200" },
    { mode: "brain-game", label: "Brain Games", icon: "🧠", description: "Fun educational games", color: "bg-pink-50 border-pink-200" },
  ];

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} pb-24 transition-colors duration-500`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
          <span>🎯</span>
          {user.ageGroup === 'scholar' ? 'Practice Arena' : 'Practice'}
        </h1>
        <TopProfileBar />
      </div>

      <div className="px-6 pb-6 max-w-4xl mx-auto">
        <p className={`font-medium ${isDark || user.ageGroup === 'explorer' ? 'text-slate-400' : 'text-slate-500'}`}>Sharpen your skills and earn rewards.</p>
      </div>

      {/* Subject Filters */}
      <div className="px-6 mb-8 max-w-4xl mx-auto">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 hide-scrollbar">
          <button
            onClick={() => setSelectedSubject("all")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              selectedSubject === "all" ? theme.pillActive : theme.pillInactive
            }`}
          >
            All Topics
          </button>
          {subjects.map(subject => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedSubject === subject.id ? theme.pillActive : theme.pillInactive
              }`}
            >
              <span>{subject.icon}</span>
              <span>{subject.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Mode Cards */}
      <div className="px-6 space-y-6 max-w-4xl mx-auto mb-10">
        {quizModes.map(mode => {
          const modeQuizzes = filteredQuizzes.filter(q => q.mode === mode.mode);
          
          // Determine custom styles for the category card based on theme
          let categoryBg = "bg-white/50";
          let categoryBorder = "border-slate-200";
          
          if (user.ageGroup === 'kids') {
            categoryBg = mode.color.split(" ")[0]; // Extract the background color from mode.color
            categoryBorder = "border-4 border-slate-900/10 shadow-[0_4px_0_rgba(0,0,0,0.05)]";
          } else if (user.ageGroup === 'explorer') {
            categoryBg = "bg-slate-800/50 backdrop-blur-md";
            categoryBorder = "border border-white/5";
          } else {
            categoryBg = isDark ? "bg-slate-900/30 border-white/5" : "bg-slate-50/50 border-slate-100";
            categoryBorder = "border";
          }
          
          return (
            <div key={mode.mode} className={`${categoryBg} rounded-3xl p-6 sm:p-8 ${categoryBorder}`}>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${user.ageGroup === 'kids' ? 'bg-white shadow-sm' : isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                   {mode.icon}
                </div>
                <div className="flex-1 w-full">
                  <h3 className={`text-xl font-black ${user.ageGroup === 'explorer' || isDark ? 'text-white' : 'text-slate-900'}`}>{mode.label}</h3>
                  <p className={`text-sm mt-1 ${isDark || user.ageGroup === 'explorer' ? 'text-slate-400' : 'text-slate-500'}`}>{mode.description}</p>
                  
                  {modeQuizzes.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {modeQuizzes.map(quiz => (
                        <button
                          key={quiz.id}
                          onClick={() => router.push(`/learn/quiz/${quiz.id}`)}
                          className={`w-full flex items-center gap-4 p-4 text-left transition-all ${theme.card} group ${user.ageGroup === 'kids' ? 'rounded-2xl active:translate-y-1 active:shadow-none' : 'rounded-xl hover:-translate-y-1'}`}
                        >
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-colors ${user.ageGroup === 'kids' ? 'bg-indigo-100 text-indigo-600' : isDark ? 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/40' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>▶</span>
                          <div className="flex-1">
                            <p className="font-bold text-base">{quiz.title}</p>
                            <p className={`text-xs mt-0.5 ${isDark || user.ageGroup === 'explorer' ? 'text-slate-400' : 'text-slate-500'}`}>{quiz.questions.length} questions • <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>{quiz.totalMarks} Marks</span></p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`mt-5 p-6 rounded-2xl text-center border-2 border-dashed ${isDark || user.ageGroup === 'explorer' ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50/50'}`}>
                      <p className={`text-sm font-medium ${isDark || user.ageGroup === 'explorer' ? 'text-slate-500' : 'text-slate-400'}`}>No {mode.label.toLowerCase()} available for this topic</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Practice CTA */}
      <div className="px-6 max-w-4xl mx-auto pb-8">
        <button
          onClick={() => router.push("/learn/quiz/mock-quiz-1")}
          className={`w-full py-5 rounded-2xl text-lg sm:text-xl font-black transition-all ${theme.button} ${user.ageGroup === 'kids' ? 'active:translate-y-1 active:shadow-none' : 'hover:-translate-y-1'}`}
        >
          🚀 Start Quick Practice
        </button>
      </div>

    </main>
  );
}
