"use client";

import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import TopProfileBar from "../../components/TopProfileBar";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";
import { useEffect, useState } from "react";
import { ChapterNotes } from "../../types";

export default function NotesPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const app = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const [note, setNote] = useState<ChapterNotes | null>(null);

  useEffect(() => {
    const foundNote = app.getChapterNoteById(noteId);
    if (foundNote) setNote(foundNote);
  }, [noteId, app]);

  if (!note) {
    return (
      <main className={`min-h-screen ${backgroundClass} ${textClass} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Note not found</h2>
          <button onClick={() => router.back()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl">Go Back</button>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen ${backgroundClass} ${textClass} relative pb-24 transition-colors duration-500`}>
      <UniversalBackground />

      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 shrink-0">
          <button onClick={() => router.back()} className="bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100 font-bold text-slate-700 bouncy-hover">
            ← Back
          </button>
          <TopProfileBar />
        </div>

        {/* Notes Title Area */}
        <div className="px-6 mb-4 max-w-5xl mx-auto w-full shrink-0">
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="text-3xl">📝</span> {note.title}
          </h1>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-6 pb-6">
          <div className={`w-full h-full rounded-[2rem] overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border-4 border-emerald-50'}`}>
            {note.pdfUrl ? (
              <iframe 
                src={note.pdfUrl} 
                className="w-full h-full bg-slate-100" 
                title={note.title}
              />
            ) : (
              <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar">
                <p className={`whitespace-pre-wrap font-mono text-sm leading-loose ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {note.content || "No content available."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
