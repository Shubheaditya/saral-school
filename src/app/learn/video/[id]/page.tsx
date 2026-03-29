"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { useGamification } from "../../contexts/GamificationContext";
import TopProfileBar from "../../components/TopProfileBar";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;
  const { currentUser } = useAuth();
  const { getVideoById } = useApp();
  const { completeVideo, addPoints, checkAndAwardBadges } = useGamification();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const video = getVideoById(videoId);
  const youtubeId = video?.youtubeUrl ? extractYouTubeId(video.youtubeUrl) : null;

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
          <button onClick={() => router.back()} className={`rounded-xl px-4 py-2 shadow-sm border font-bold bouncy-hover ${isDark ? 'bg-slate-800 border-white/10 text-white' : 'bg-white border-slate-100 text-slate-700'}`}>
            ← Back
          </button>
          <TopProfileBar />
        </div>

        {/* Video Player Area */}
        <div className="px-4 md:px-6 max-w-5xl mx-auto mb-6">
          <div className={`w-full aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden ${isDark ? 'bg-slate-900 border border-white/10 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900 shadow-xl'}`}>
            {youtubeId ? (
              /* YouTube Embed */
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&iv_load_policy=3&disablekb=0&fs=1&color=white`}
                title={video?.title || "Video Lecture"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0 }}
              />
            ) : video?.videoUrl ? (
              /* Direct Video File */
              <video
                src={video.videoUrl}
                controls
                className="w-full h-full object-contain bg-black"
                controlsList="nodownload"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              /* Placeholder */
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                <span className="text-6xl mb-4">🎬</span>
                <h3 className="text-white text-lg font-bold mb-2">Video Lecture</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  This video will appear here once uploaded by an administrator.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="px-6 mb-6 max-w-3xl mx-auto">
          <h1 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{video?.title || "Video Lecture"}</h1>
          {video?.description && <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{video.description}</p>}
          {video?.duration && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>⏱ {video.duration}</p>}

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
              onClick={() => router.back()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold bouncy-hover"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Notes Section (for Scholars) */}
        {currentUser?.ageGroup === "scholar" && (
          <div className="px-6 max-w-3xl mx-auto">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`w-full flex items-center justify-between rounded-2xl p-4 shadow-sm border mb-3 ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-indigo-100'}`}
            >
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>📝 My Notes</span>
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{showNotes ? "▲" : "▼"}</span>
            </button>
            {showNotes && (
              <div className={`rounded-2xl p-4 shadow-sm border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-100'}`}>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your notes here..."
                  className={`w-full h-32 p-3 rounded-xl border focus:outline-none text-sm placeholder:text-slate-300 resize-none ${isDark ? 'bg-slate-800 border-white/10 text-white focus:border-indigo-400' : 'border-slate-200 text-slate-700 focus:border-indigo-400'}`}
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
