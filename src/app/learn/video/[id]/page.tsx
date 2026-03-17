"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useGamification } from "../../contexts/GamificationContext";
import TopProfileBar from "../../components/TopProfileBar";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";

export default function VideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;
  const { currentUser } = useAuth();
  const { completeVideo, addPoints, checkAndAwardBadges } = useGamification();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    completeVideo(videoId);
    addPoints(10);
    checkAndAwardBadges();
    setCompleted(true);
  };

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} relative pb-24 transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100 font-bold text-slate-700 bouncy-hover">
            ← Back
          </button>
          <TopProfileBar />
        </div>

        {/* Video Player Area */}
        <div className={`w-full aspect-video ${isDark ? 'bg-slate-900 border border-white/10 shadow-indigo-500/20' : 'bg-slate-900 border-none rounded-[2rem] shadow-xl'} flex flex-col items-center justify-center text-center overflow-hidden mb-6 max-w-5xl mx-auto`}>
          <span className="text-6xl mb-4">🎬</span>
          <h3 className="text-white text-lg font-bold mb-2">Video Lecture</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            This video will appear here once uploaded by an administrator.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">▶</span>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="px-6 mb-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Video Lecture</h1>
          <p className="text-slate-500">ID: {videoId}</p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {!completed ? (
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 bouncy-hover"
              >
                ✅ Mark as Complete (+10 pts)
              </button>
            ) : (
              <div className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-bold text-center">
                ✅ Completed!
              </div>
            )}
            <button
              onClick={() => router.push(`/learn/subject/math`)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold bouncy-hover"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Notes Section (for Scholars) */}
        {currentUser?.ageGroup === "scholar" && (
          <div className="px-6 max-w-3xl mx-auto">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="w-full flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-indigo-100 mb-3"
            >
              <span className="font-bold text-slate-900">📝 My Notes</span>
              <span className="text-slate-400">{showNotes ? "▲" : "▼"}</span>
            </button>
            {showNotes && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your notes here..."
                  className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:outline-none text-sm text-slate-700 placeholder:text-slate-300 resize-none"
                />
                <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold bouncy-hover">
                  Save Notes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
