"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Subject, Semester, Chapter, ContentItem, ContentType,
  VideoLecture, Quiz, ChapterNotes, FormulaSheet, StudentNote,
  AdminContent, generateSemesters,
} from "../types";
import { DEFAULT_SUBJECTS, MOCK_QUIZ } from "../mockData";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

interface AppContextType {
  subjects: Subject[];
  videos: VideoLecture[];
  quizzes: Quiz[];
  chapterNotes: ChapterNotes[];
  formulaSheets: FormulaSheet[];
  studentNotes: StudentNote[];
  // Subject ops
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  // Chapter ops
  addChapter: (subjectId: string, semesterId: string, chapter: Chapter) => void;
  deleteChapter: (subjectId: string, semesterId: string, chapterId: string) => void;
  updateChapter: (subjectId: string, semesterId: string, chapterId: string, updates: Partial<Chapter>) => void;
  // Content item ops
  addContentItem: (subjectId: string, semesterId: string, chapterId: string, item: ContentItem) => void;
  removeContentItem: (subjectId: string, semesterId: string, chapterId: string, itemId: string) => void;
  reorderContentItems: (subjectId: string, semesterId: string, chapterId: string, items: ContentItem[]) => void;
  // Video ops
  addVideo: (video: VideoLecture) => void;
  deleteVideo: (id: string) => void;
  // Quiz ops
  addQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  // Notes ops
  addChapterNote: (note: ChapterNotes) => void;
  deleteChapterNote: (id: string) => void;
  // Formula sheet ops
  addFormulaSheet: (sheet: FormulaSheet) => void;
  deleteFormulaSheet: (id: string) => void;
  // Student note ops
  addStudentNote: (note: StudentNote) => void;
  deleteStudentNote: (id: string) => void;
  // Getters
  getSubjectById: (id: string) => Subject | undefined;
  getQuizById: (id: string) => Quiz | undefined;
  getVideoById: (id: string) => VideoLecture | undefined;
  getChapterNoteById: (id: string) => ChapterNotes | undefined;
  getFormulaSheetById: (id: string) => FormulaSheet | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "saral_content";

function getDefaultContent(): AdminContent {
  return {
    subjects: DEFAULT_SUBJECTS,
    videos: [],
    quizzes: [MOCK_QUIZ],
    chapterNotes: [],
    formulaSheets: [],
    studentNotes: [],
  };
}

function loadContent(): AdminContent {
  if (typeof window === "undefined") return getDefaultContent();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AdminContent;
      // Migrate old data: ensure subjects have semesters
      if (data.subjects && data.subjects.length > 0 && !data.subjects[0].semesters) {
        data.subjects = data.subjects.map(s => ({
          ...s,
          semesters: generateSemesters(s.id),
        }));
      }
      if (!data.chapterNotes) data.chapterNotes = [];
      if (!data.formulaSheets) data.formulaSheets = [];
      if (!data.studentNotes) data.studentNotes = [];
      return data;
    }
  } catch {}
  return getDefaultContent();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<AdminContent>(getDefaultContent());
  const [loaded, setLoaded] = useState(false);
  const [stateId, setStateId] = useState<string | null>(null);

  useEffect(() => {
    async function initSupabase() {
      if (!isSupabaseConfigured) {
        console.warn("Supabase not configured. Using local storage mode.");
        setContent(loadContent());
        setLoaded(true);
        return;
      }
      try {
        const { data, error } = await supabase.from('saral_state').select('*').limit(1).maybeSingle();
        if (data && data.content) {
          const loadedData = data.content as AdminContent;
          if (loadedData.subjects && loadedData.subjects.length > 0 && !loadedData.subjects[0].semesters) {
            loadedData.subjects = loadedData.subjects.map(s => ({ ...s, semesters: generateSemesters(s.id) }));
          }
          if (!loadedData.chapterNotes) loadedData.chapterNotes = [];
          if (!loadedData.formulaSheets) loadedData.formulaSheets = [];
          if (!loadedData.studentNotes) loadedData.studentNotes = [];
          
          setContent(loadedData);
          setStateId(data.id);
        } else {
           const defaultState = loadContent(); 
           const { data: insertData } = await supabase.from('saral_state').insert({ content: defaultState }).select().single();
           setContent(defaultState);
           if (insertData) setStateId(insertData.id);
        }
      } catch (err) {
        console.error("Failed to load from Supabase:", err);
        setContent(loadContent());
      } finally {
        setLoaded(true);
      }
    }
    initSupabase();
  }, []);

  useEffect(() => {
    if (loaded && stateId && isSupabaseConfigured) {
      supabase.from('saral_state').update({ content, updated_at: new Date().toISOString() }).eq('id', stateId).then();
    }
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    }
  }, [content, loaded, stateId]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading Saral School Engine...</p>
      </div>
    );
  }

  // --- Subject ops ---
  const addSubject = useCallback((subject: Subject) => {
    setContent(prev => ({ ...prev, subjects: [...prev.subjects, subject] }));
  }, []);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setContent(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
  }, []);

  // --- Chapter ops ---
  const addChapter = useCallback((subjectId: string, semesterId: string, chapter: Chapter) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? { ...sem, chapters: [...sem.chapters, chapter] }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  const deleteChapter = useCallback((subjectId: string, semesterId: string, chapterId: string) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? { ...sem, chapters: sem.chapters.filter(c => c.id !== chapterId) }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  const updateChapter = useCallback((subjectId: string, semesterId: string, chapterId: string, updates: Partial<Chapter>) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? { ...sem, chapters: sem.chapters.map(c => c.id === chapterId ? { ...c, ...updates } : c) }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  // --- Content item ops ---
  const addContentItem = useCallback((subjectId: string, semesterId: string, chapterId: string, item: ContentItem) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? {
                      ...sem,
                      chapters: sem.chapters.map(c =>
                        c.id === chapterId
                          ? { ...c, contentItems: [...c.contentItems, item].sort((a, b) => a.order - b.order) }
                          : c
                      ),
                    }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  const removeContentItem = useCallback((subjectId: string, semesterId: string, chapterId: string, itemId: string) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? {
                      ...sem,
                      chapters: sem.chapters.map(c =>
                        c.id === chapterId
                          ? { ...c, contentItems: c.contentItems.filter(ci => ci.id !== itemId) }
                          : c
                      ),
                    }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  const reorderContentItems = useCallback((subjectId: string, semesterId: string, chapterId: string, items: ContentItem[]) => {
    setContent(prev => ({
      ...prev,
      subjects: prev.subjects.map(s =>
        s.id === subjectId
          ? {
              ...s,
              semesters: s.semesters.map(sem =>
                sem.id === semesterId
                  ? {
                      ...sem,
                      chapters: sem.chapters.map(c =>
                        c.id === chapterId ? { ...c, contentItems: items } : c
                      ),
                    }
                  : sem
              ),
            }
          : s
      ),
    }));
  }, []);

  // --- Video ops ---
  const addVideo = useCallback((video: VideoLecture) => {
    setContent(prev => ({ ...prev, videos: [...prev.videos, video] }));
  }, []);
  const deleteVideo = useCallback((id: string) => {
    setContent(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  }, []);

  // --- Quiz ops ---
  const addQuiz = useCallback((quiz: Quiz) => {
    setContent(prev => ({ ...prev, quizzes: [...prev.quizzes, quiz] }));
  }, []);
  const deleteQuiz = useCallback((id: string) => {
    setContent(prev => ({ ...prev, quizzes: prev.quizzes.filter(q => q.id !== id) }));
  }, []);

  // --- Chapter notes ops ---
  const addChapterNote = useCallback((note: ChapterNotes) => {
    setContent(prev => ({ ...prev, chapterNotes: [...prev.chapterNotes, note] }));
  }, []);
  const deleteChapterNote = useCallback((id: string) => {
    setContent(prev => ({ ...prev, chapterNotes: prev.chapterNotes.filter(n => n.id !== id) }));
  }, []);

  // --- Formula sheet ops ---
  const addFormulaSheet = useCallback((sheet: FormulaSheet) => {
    setContent(prev => ({ ...prev, formulaSheets: [...prev.formulaSheets, sheet] }));
  }, []);
  const deleteFormulaSheet = useCallback((id: string) => {
    setContent(prev => ({ ...prev, formulaSheets: prev.formulaSheets.filter(f => f.id !== id) }));
  }, []);

  // --- Student note ops ---
  const addStudentNote = useCallback((note: StudentNote) => {
    setContent(prev => ({ ...prev, studentNotes: [...prev.studentNotes, note] }));
  }, []);
  const deleteStudentNote = useCallback((id: string) => {
    setContent(prev => ({ ...prev, studentNotes: prev.studentNotes.filter(n => n.id !== id) }));
  }, []);

  // --- Getters ---
  const getSubjectById = useCallback((id: string) => content.subjects.find(s => s.id === id), [content.subjects]);
  const getQuizById = useCallback((id: string) => content.quizzes.find(q => q.id === id), [content.quizzes]);
  const getVideoById = useCallback((id: string) => content.videos.find(v => v.id === id), [content.videos]);
  const getChapterNoteById = useCallback((id: string) => content.chapterNotes.find(n => n.id === id), [content.chapterNotes]);
  const getFormulaSheetById = useCallback((id: string) => content.formulaSheets.find(f => f.id === id), [content.formulaSheets]);

  if (!loaded) return null;

  return (
    <AppContext.Provider value={{
      ...content,
      addSubject, updateSubject, deleteSubject,
      addChapter, deleteChapter, updateChapter,
      addContentItem, removeContentItem, reorderContentItems,
      addVideo, deleteVideo,
      addQuiz, deleteQuiz,
      addChapterNote, deleteChapterNote,
      addFormulaSheet, deleteFormulaSheet,
      addStudentNote, deleteStudentNote,
      getSubjectById, getQuizById, getVideoById, getChapterNoteById, getFormulaSheetById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
