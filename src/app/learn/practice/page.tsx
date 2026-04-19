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

  const user = currentUser as User;
  
  const getTheme = () => {
    switch (user.ageGroup) {
      case "kids":
         return { bg: "bg-rose-50", text: "text-slate-900", card: "bg-white shadow-[0_4px_0_#f3e8ee]", border: "border-rose-200", button: "bg-gradient-to-r from-rose-400 to-purple-500 text-white shadow-lg", pillBg: "bg-white", pillActive: "bg-gradient-to-r from-rose-400 to-purple-500 text-white shadow-lg", pillInactive: "text-slate-500 border-2 border-slate-100" };
      case "scholar":
      default:
         return { 
           bg: "bg-[#F8FAFC]", 
           text: "text-slate-900", 
           card: "bg-white shadow-sm border border-slate-200", 
           border: "border-slate-200",
           button: "bg-gradient-to-r from-rose-500 to-purple-500 text-white hover:shadow-lg",
           pillBg: "bg-white",
           pillActive: "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-sm",
           pillInactive: "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
         };
    }
  };

  const theme = getTheme();

  const filteredQuizzes = selectedSubject === "all"
    ? quizzes
    : quizzes.filter(q => q.subjectId === selectedSubject);

  const quizModes = [
    { mode: "quiz", label: "Quick Quizzes", icon: "📝", description: "Short, topic-specific quizzes", color: "bg-rose-50 border-rose-200" },
    { mode: "chapter-test", label: "Chapter Tests", icon: "📋", description: "Full chapter assessments", color: "bg-purple-50 border-purple-200" },
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
        <p className="font-medium text-slate-500">Sharpen your skills and earn rewards.</p>
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
          
          let categoryBg = "bg-white/50";
          let categoryBorder = "border-slate-200";
          
          if (user.ageGroup === 'kids') {
            categoryBg = mode.color.split(" ")[0];
            categoryBorder = "border-4 border-slate-900/10 shadow-[0_4px_0_rgba(0,0,0,0.05)]";
          } else {
            categoryBg = "bg-slate-50/50 border-slate-100";
            categoryBorder = "border";
          }
          
          return (
            <div key={mode.mode} className={`${categoryBg} rounded-3xl p-6 sm:p-8 ${categoryBorder}`}>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white shadow-sm">
                   {mode.icon}
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-black text-slate-900">{mode.label}</h3>
                  <p className="text-sm mt-1 text-slate-500">{mode.description}</p>
                  
                  {modeQuizzes.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {modeQuizzes.map(quiz => (
                        <button
                          key={quiz.id}
                          onClick={() => router.push(`/learn/quiz/${quiz.id}`)}
                          className={`w-full flex items-center gap-4 p-4 text-left transition-all ${theme.card} group ${user.ageGroup === 'kids' ? 'rounded-2xl active:translate-y-1 active:shadow-none' : 'rounded-xl hover:-translate-y-1'}`}
                        >
                          <span className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-colors bg-rose-50 text-rose-600 group-hover:bg-rose-100">▶</span>
                          <div className="flex-1">
                            <p className="font-bold text-base">{quiz.title}</p>
                            <p className="text-xs mt-0.5 text-slate-500">{quiz.questions.length} questions • <span className="text-amber-600">{quiz.totalPoints} pts</span></p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 p-6 rounded-2xl text-center border-2 border-dashed border-slate-200 bg-slate-50/50">
                      <p className="text-sm font-medium text-slate-400">No {mode.label.toLowerCase()} available for this topic</p>
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
