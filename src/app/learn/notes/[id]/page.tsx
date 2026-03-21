"use client";

import { useRouter, useParams } from "next/navigation";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import TopProfileBar from "../../components/TopProfileBar";
import UniversalBackground from "../../components/UniversalBackground";
import { useUniversalTheme } from "../../hooks/useUniversalTheme";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChapterNotes } from "../../types";
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function NotesPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const app = useApp();
  const { backgroundClass, textClass, isDark } = useUniversalTheme();

  const [note, setNote] = useState<ChapterNotes | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerWidth, setContainerWidth] = useState<number>();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fix 1: Prevent dark mode flash by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive width calculation with viewport clamp
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const measured = containerRef.current.clientWidth;
      const maxSafe = window.innerWidth - 32; // account for page padding
      setContainerWidth(Math.min(measured, maxSafe));
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [note, updateWidth]);

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

  const isImage = note.pdfUrl?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp|avif|svg)$/);
  const isWord = note.pdfUrl?.toLowerCase().match(/\.(doc|docx)$/);

  return (
    <main 
      className={`min-h-screen w-full max-w-full overflow-x-hidden ${backgroundClass} ${textClass} relative transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}
    >
      <UniversalBackground />

      <div className="relative z-10 w-full h-[100dvh] flex flex-col overflow-hidden">
        {/* Header — wraps on small screens */}
        <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 shrink-0">
          <button 
            onClick={() => router.back()} 
            className={`rounded-xl px-3 py-2 shadow-sm border font-bold text-sm bouncy-hover ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}
          >
            ← Back
          </button>
          
          <div className="flex items-center gap-2 ml-auto min-w-0">
            {note.pdfUrl && (
              <a 
                href={note.pdfUrl} 
                target="_blank" 
                download 
                rel="noopener noreferrer" 
                className="bg-indigo-600 text-white rounded-xl px-3 py-2 shadow-md font-bold text-xs sm:text-sm bouncy-hover flex items-center gap-1.5 whitespace-nowrap"
              >
                📥 Download
              </a>
            )}
            <TopProfileBar />
          </div>
        </div>

        {/* Notes Title — dark mode aware */}
        <div className="px-3 sm:px-6 mb-3 max-w-5xl mx-auto w-full shrink-0">
          <h1 className={`text-lg sm:text-2xl font-black flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <span className="text-2xl sm:text-3xl">📝</span>
            <span className="truncate">{note.title}</span>
          </h1>
        </div>

        {/* Document Viewer — contained, no overflow */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-3 sm:pb-6 min-h-0">
          <div className={`w-full h-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white border-2 border-emerald-50'}`}>
            {note.pdfUrl ? (
              isImage ? (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                  <img src={note.pdfUrl} alt={note.title} className="max-w-full h-auto rounded-xl shadow-sm" />
                </div>
              ) : isWord ? (
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.pdfUrl)}&embedded=true`}
                  className="w-full h-full bg-slate-100 border-0" 
                  title={note.title}
                />
              ) : (
                <div 
                  className="w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 flex flex-col items-center custom-scrollbar box-border" 
                  ref={containerRef}
                  style={{ touchAction: 'pan-y' }}
                >
                  <Document
                    file={note.pdfUrl}
                    onLoadSuccess={({ numPages }) => { setNumPages(numPages); updateWidth(); }}
                    loading={<div className="p-8 text-slate-500 font-bold animate-pulse">Loading Document...</div>}
                    className="flex flex-col gap-4 sm:gap-6 w-full items-center"
                  >
                    {Array.from(new Array(numPages || 0), (_, index) => (
                      <Page 
                        key={`page_${index + 1}`} 
                        pageNumber={index + 1} 
                        width={containerWidth ? Math.max(containerWidth - 24, 200) : undefined} 
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-lg rounded-xl overflow-hidden bg-white max-w-full"
                      />
                    ))}
                  </Document>
                </div>
              )
            ) : (
              <div className="w-full h-full p-4 sm:p-8 overflow-y-auto custom-scrollbar">
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
