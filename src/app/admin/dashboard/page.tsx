"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../learn/contexts/AppContext";
import {
  Subject, Semester, Chapter, ContentItem, ContentType,
  VideoLecture, Quiz, Question, QuestionType, ChapterNotes, FormulaSheet, MediaBlock,
  generateSemesters, CONTENT_TYPE_INFO,
} from "../../learn/types";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

type AdminView =
  | { screen: "subjects" }
  | { screen: "semesters"; subjectId: string }
  | { screen: "chapters"; subjectId: string; semesterId: string }
  | { screen: "chapter-detail"; subjectId: string; semesterId: string; chapterId: string };

export default function AdminDashboard() {
  const router = useRouter();
  const app = useApp();
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<AdminView>({ screen: "subjects" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("saral_admin") !== "true") {
        router.replace("/admin");
      } else {
        setAuthed(true);
      }
    }
  }, [router]);

  if (!authed) return null;

  const handleLogout = () => {
    sessionStorage.removeItem("saral_admin");
    router.push("/admin");
  };

  // Build breadcrumb
  const breadcrumb: { label: string; onClick?: () => void }[] = [];
  breadcrumb.push({ label: "Subjects", onClick: () => setView({ screen: "subjects" }) });

  if (view.screen !== "subjects") {
    const subj = app.getSubjectById(view.subjectId);
    breadcrumb.push({
      label: `${subj?.icon || ""} ${subj?.name || ""}`,
      onClick: () => setView({ screen: "semesters", subjectId: view.subjectId }),
    });
  }
  if (view.screen === "chapters" || view.screen === "chapter-detail") {
    const subj = app.getSubjectById(view.subjectId);
    const sem = subj?.semesters.find((s: Semester) => s.id === view.semesterId);
    breadcrumb.push({
      label: sem?.title || "",
      onClick: () => setView({ screen: "chapters", subjectId: view.subjectId, semesterId: view.semesterId }),
    });
  }
  if (view.screen === "chapter-detail") {
    const subj = app.getSubjectById(view.subjectId);
    const sem = subj?.semesters.find((s: Semester) => s.id === view.semesterId);
    const ch = sem?.chapters.find((c: Chapter) => c.id === view.chapterId);
    breadcrumb.push({ label: ch?.title || "" });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-indigo-600">SS</span>
            <h1 className="text-xl font-black text-slate-900">Saral School Admin</h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100">
            Logout
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap text-sm">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300">/</span>}
              {item.onClick && i < breadcrumb.length - 1 ? (
                <button onClick={item.onClick} className="text-indigo-600 hover:text-indigo-800 font-bold">
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-700 font-bold">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {view.screen === "subjects" && (
          <SubjectsScreen
            subjects={app.subjects}
            addSubject={app.addSubject}
            deleteSubject={app.deleteSubject}
            onOpen={(subjectId) => setView({ screen: "semesters", subjectId })}
          />
        )}
        {view.screen === "semesters" && (
          <SemestersScreen
            subject={app.getSubjectById(view.subjectId)!}
            onOpen={(semesterId) => setView({ screen: "chapters", subjectId: view.subjectId, semesterId })}
          />
        )}
        {view.screen === "chapters" && (
          <ChaptersScreen
            subject={app.getSubjectById(view.subjectId)!}
            semesterId={view.semesterId}
            addChapter={app.addChapter}
            deleteChapter={app.deleteChapter}
            onOpen={(chapterId) => setView({ screen: "chapter-detail", subjectId: view.subjectId, semesterId: view.semesterId, chapterId })}
          />
        )}
        {view.screen === "chapter-detail" && (
          <ChapterDetailScreen
            subject={app.getSubjectById(view.subjectId)!}
            semesterId={view.semesterId}
            chapterId={view.chapterId}
            app={app}
          />
        )}
      </div>
    </main>
  );
}

// ==================== SUBJECTS ====================
function SubjectsScreen({ subjects, addSubject, deleteSubject, onOpen }: {
  subjects: Subject[]; addSubject: (s: Subject) => void; deleteSubject: (id: string) => void; onOpen: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(""); const [icon, setIcon] = useState("book"); const [color, setColor] = useState("indigo");

  const handleAdd = () => {
    if (!name.trim()) return;
    const id = `sub-${Date.now()}`;
    addSubject({ id, name, icon, color, semesters: generateSemesters(id) });
    setName(""); setIcon("book"); setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-900">Subjects ({subjects.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700">+ Add Subject</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          <h3 className="font-bold text-slate-900 mb-4">New Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g., Mathematics" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Icon (emoji)</label>
              <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Color</label>
              <select value={color} onChange={e => setColor(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                {["indigo","emerald","pink","amber","violet","cyan","red","blue"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => {
          const totalChapters = subject.semesters.reduce((sum, sem) => sum + sem.chapters.length, 0);
          return (
            <div key={subject.id} onClick={() => onOpen(subject.id)} className="bg-white rounded-xl p-5 border border-slate-200 text-left hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{subject.icon}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >Delete</button>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
              <p className="text-sm text-slate-400">{subject.semesters.length} semesters &middot; {totalChapters} chapters</p>
              <span className="text-indigo-500 text-sm font-bold mt-2 block">Open &rarr;</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== SEMESTERS ====================
function SemestersScreen({ subject, onOpen }: { subject: Subject; onOpen: (semId: string) => void }) {
  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 mb-2">{subject.icon} {subject.name}</h2>
      <p className="text-slate-500 mb-6">Select a semester to manage its chapters and content.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {subject.semesters.map(sem => {
          const chapterCount = sem.chapters.length;
          const contentCount = sem.chapters.reduce((sum, ch) => sum + ch.contentItems.length, 0);
          return (
            <button
              key={sem.id}
              onClick={() => onOpen(sem.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 text-center hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <p className="text-2xl font-black text-indigo-600 mb-1">{sem.number}</p>
              <p className="text-xs font-bold text-slate-700">{sem.title}</p>
              <p className="text-xs text-slate-400 mt-1">{chapterCount} ch &middot; {contentCount} items</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==================== CHAPTERS ====================
function ChaptersScreen({ subject, semesterId, addChapter, deleteChapter, onOpen }: {
  subject: Subject; semesterId: string;
  addChapter: (subjectId: string, semesterId: string, chapter: Chapter) => void;
  deleteChapter: (subjectId: string, semesterId: string, chapterId: string) => void;
  onOpen: (chapterId: string) => void;
}) {
  const semester = subject.semesters.find(s => s.id === semesterId);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  if (!semester) return <p>Semester not found</p>;

  const handleAdd = () => {
    if (!title.trim()) return;
    const id = `ch-${Date.now()}`;
    addChapter(subject.id, semesterId, {
      id, semesterId, subjectId: subject.id, title,
      order: semester.chapters.length + 1,
      contentItems: [],
    });
    setTitle(""); setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 mb-1">{subject.icon} {subject.name} &mdash; {semester.title}</h2>
      <p className="text-slate-500 mb-6">Manage chapters in this semester. Click a chapter to add content.</p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-500">{semester.chapters.length} chapters</span>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700">+ Add Chapter</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 mb-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-600 block mb-1">Chapter Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g., Introduction to Numbers" autoFocus onKeyDown={e => e.key === "Enter" && handleAdd()} />
          </div>
          <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">Save</button>
          <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
        </div>
      )}

      {semester.chapters.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-dashed border-slate-300 text-center">
          <span className="text-4xl block mb-2">📂</span>
          <p className="text-slate-500">No chapters yet. Click &quot;Add Chapter&quot; to create your first chapter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {semester.chapters.sort((a, b) => a.order - b.order).map((chapter, idx) => (
            <div
              key={chapter.id}
              onClick={() => onOpen(chapter.id)}
              className="w-full bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-4 text-left hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-lg font-black text-indigo-600 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{chapter.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{chapter.contentItems.length} content items</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChapter(subject.id, semesterId, chapter.id); }}
                className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100"
              >Delete</button>
              <span className="text-indigo-400 font-bold text-sm">Open &rarr;</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== CHAPTER DETAIL (Content Management) ====================
function ChapterDetailScreen({ subject, semesterId, chapterId, app }: {
  subject: Subject; semesterId: string; chapterId: string;
  app: ReturnType<typeof useApp>;
}) {
  const semester = subject.semesters.find(s => s.id === semesterId);
  const chapter = semester?.chapters.find(c => c.id === chapterId);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addingType, setAddingType] = useState<ContentType | null>(null);

  if (!semester || !chapter) return <p>Chapter not found</p>;

  const items = [...chapter.contentItems].sort((a, b) => a.order - b.order);

  const handleAddContentType = (type: ContentType) => {
    setAddingType(type);
    setShowAddMenu(false);
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    newItems.forEach((item, i) => item.order = i + 1);
    app.reorderContentItems(subject.id, semesterId, chapterId, newItems);
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= items.length - 1) return;
    const newItems = [...items];
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    newItems.forEach((item, i) => item.order = i + 1);
    app.reorderContentItems(subject.id, semesterId, chapterId, newItems);
  };

  const handleRemoveItem = (itemId: string, refId: string, type: ContentType) => {
    app.removeContentItem(subject.id, semesterId, chapterId, itemId);
    // Also delete the referenced content
    if (type === "video") app.deleteVideo(refId);
    if (type === "quiz" || type === "test") app.deleteQuiz(refId);
    if (type === "notes") app.deleteChapterNote(refId);
    if (type === "formula-sheet") app.deleteFormulaSheet(refId);
  };

  const getContentTitle = (item: ContentItem): string => {
    switch (item.type) {
      case "video": return app.videos.find((v: VideoLecture) => v.id === item.refId)?.title || "Untitled Video";
      case "quiz": case "test": return app.quizzes.find((q: Quiz) => q.id === item.refId)?.title || "Untitled Quiz";
      case "notes": return app.chapterNotes.find((n: ChapterNotes) => n.id === item.refId)?.title || "Untitled Notes";
      case "formula-sheet": return app.formulaSheets.find((f: FormulaSheet) => f.id === item.refId)?.title || "Untitled Formula Sheet";
      default: return "Unknown";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black text-slate-900 mb-1">{chapter.title}</h2>
      <p className="text-slate-500 text-sm mb-6">{subject.icon} {subject.name} &rarr; {semester.title}</p>

      {/* Ordered Content Items */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Content Items ({items.length})</h3>
        <div className="relative">
          <button onClick={() => setShowAddMenu(!showAddMenu)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700">
            + Add Content
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-xl border border-slate-200 shadow-xl p-2 w-56 z-20">
              {(Object.keys(CONTENT_TYPE_INFO) as ContentType[]).map(type => {
                const info = CONTENT_TYPE_INFO[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleAddContentType(type)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    <span>{info.icon}</span> {info.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {items.length === 0 && !addingType ? (
        <div className="bg-white rounded-xl p-12 border border-dashed border-slate-300 text-center">
          <span className="text-4xl block mb-2">📦</span>
          <p className="text-slate-500 mb-3">No content yet. Add videos, notes, quizzes, tests, or formula sheets.</p>
          <button onClick={() => setShowAddMenu(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">+ Add Content</button>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {items.map((item, idx) => {
            const info = CONTENT_TYPE_INFO[item.type];
            return (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3 group">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-xs">^</button>
                  <button onClick={() => handleMoveDown(idx)} disabled={idx === items.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-xs">v</button>
                </div>
                <span className="text-sm font-bold text-slate-300 w-6 text-center">{idx + 1}</span>
                <div className={`w-8 h-8 bg-${info.color}-50 rounded-lg flex items-center justify-center text-lg shrink-0`}>{info.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{getContentTitle(item)}</p>
                  <p className="text-xs text-slate-400">{info.label}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id, item.refId, item.type)}
                  className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100"
                >Remove</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Content Forms */}
      {addingType === "video" && (
        <AddVideoForm
          subjectId={subject.id} semesterId={semesterId} chapterId={chapterId}
          order={items.length + 1}
          app={app}
          onClose={() => setAddingType(null)}
        />
      )}
      {addingType === "notes" && (
        <AddNotesForm
          subjectId={subject.id} semesterId={semesterId} chapterId={chapterId}
          order={items.length + 1}
          app={app}
          onClose={() => setAddingType(null)}
        />
      )}
      {addingType === "formula-sheet" && (
        <AddFormulaSheetForm
          subjectId={subject.id} semesterId={semesterId} chapterId={chapterId}
          order={items.length + 1}
          app={app}
          onClose={() => setAddingType(null)}
        />
      )}
      {(addingType === "quiz" || addingType === "test") && (
        <AddQuizForm
          subjectId={subject.id} semesterId={semesterId} chapterId={chapterId}
          order={items.length + 1}
          mode={addingType === "test" ? "chapter-test" : "quiz"}
          label={addingType === "test" ? "Test" : "Quiz"}
          app={app}
          onClose={() => setAddingType(null)}
        />
      )}
    </div>
  );
}

// ==================== ADD VIDEO FORM ====================
function AddVideoForm({ subjectId, semesterId, chapterId, order, app, onClose }: {
  subjectId: string; semesterId: string; chapterId: string; order: number;
  app: ReturnType<typeof useApp>; onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setUploading(true);

    let finalVideoUrl = videoUrl;
    if (file) {
      if (!isSupabaseConfigured) {
        alert("Cannot upload file: Supabase is not configured (missing environment variables).");
        setUploading(false);
        return;
      }
      const fileName = `videos/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage.from('saral_files').upload(fileName, file);
      if (error) {
        console.error("Video upload failed:", error);
        alert(`Failed to upload video to Supabase: ${error.message}\nMake sure your storage bucket exists and policies are applied.`);
        setUploading(false);
        return;
      }
      if (data) {
        finalVideoUrl = supabase.storage.from('saral_files').getPublicUrl(fileName).data.publicUrl;
      }
    }

    const videoId = `vid-${Date.now()}`;
    const isYouTubeUrl = (url: string) => /(?:youtube\.com|youtu\.be)/i.test(url);
    const youtubeUrl = finalVideoUrl && isYouTubeUrl(finalVideoUrl) ? finalVideoUrl : undefined;
    const directUrl = finalVideoUrl && !isYouTubeUrl(finalVideoUrl) ? finalVideoUrl : undefined;
    app.addVideo({ id: videoId, chapterId, subjectId, title, description, videoUrl: directUrl || undefined, youtubeUrl: youtubeUrl || undefined, duration: duration || undefined });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: "video", order, refId: videoId });
    setUploading(false);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 mb-4">
      <h4 className="font-bold text-slate-900 mb-4">Add Video Lecture</h4>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Video title" autoFocus />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm h-16 resize-none" placeholder="Brief description" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">🔗 YouTube / Video Link</label>
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="https://youtube.com/..." disabled={!!file} />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">OR Upload Video File (.mp4)</label>
            <input type="file" accept="video/mp4,video/webm" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 font-bold hover:file:bg-indigo-100" disabled={!!videoUrl} />
          </div>
        </div>
        <div>
           <label className="text-sm font-bold text-slate-600 block mb-1">Duration</label>
           <input value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="e.g., 12:30" />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} disabled={uploading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm disabled:opacity-50">
            {uploading ? "Uploading..." : "Save Video"}
          </button>
          <button onClick={onClose} disabled={uploading} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ==================== ADD NOTES FORM ====================
function AddNotesForm({ subjectId, semesterId, chapterId, order, app, onClose }: {
  subjectId: string; semesterId: string; chapterId: string; order: number;
  app: ReturnType<typeof useApp>; onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setUploading(true);

    let finalPdfUrl = "";
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload file');
        
        const data = await res.json();
        finalPdfUrl = data.url;
      } catch (error) {
        console.error("File upload failed:", error);
        alert(`Failed to upload document to Cloudinary. Please try again.`);
        setUploading(false);
        return;
      }
    }

    const noteId = `note-${Date.now()}`;
    app.addChapterNote({ id: noteId, chapterId, subjectId, title, content, pdfUrl: finalPdfUrl || undefined });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: "notes", order, refId: noteId });
    setUploading(false);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-emerald-200 mb-4">
      <h4 className="font-bold text-slate-900 mb-4">Add Notes</h4>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Notes title" autoFocus />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Content (Text) OR</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm h-32 resize-y font-mono" placeholder="Write notes..." />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Upload Note Document (PDF, Image, Word)</label>
          <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleFileUpload} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 font-bold hover:file:bg-emerald-100" />
          {file && <p className="text-xs text-emerald-600 font-bold mt-1">âœ“ Document Selected: {file.name}</p>}
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={handleSave} disabled={uploading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm disabled:opacity-50">
            {uploading ? "Uploading..." : "Save Notes"}
          </button>
          <button onClick={onClose} disabled={uploading} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ==================== ADD FORMULA SHEET FORM ====================
function AddFormulaSheetForm({ subjectId, semesterId, chapterId, order, app, onClose }: {
  subjectId: string; semesterId: string; chapterId: string; order: number;
  app: ReturnType<typeof useApp>; onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    const sheetId = `fs-${Date.now()}`;
    app.addFormulaSheet({ id: sheetId, chapterId, subjectId, title, content });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: "formula-sheet", order, refId: sheetId });
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-violet-200 mb-4">
      <h4 className="font-bold text-slate-900 mb-4">Add Formula Sheet</h4>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Formula sheet title" autoFocus />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">Formulas & Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm h-40 resize-y font-mono" placeholder="Write formulas and key concepts..." />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">Save Formula Sheet</button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ==================== ADD QUIZ/TEST FORM ====================
function AddQuizForm({ subjectId, semesterId, chapterId, order, mode, label, app, onClose }: {
  subjectId: string; semesterId: string; chapterId: string; order: number;
  mode: "quiz" | "chapter-test"; label: string;
  app: ReturnType<typeof useApp>; onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload file');
      const data = await res.json();
      setUploading(false);
      return data.url;
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      return null;
    }
  };

  const handleApplyQuestionUpdate = (index: number, updatedQ: Question) => {
    const newQs = [...questions];
    newQs[index] = updatedQ;
    setQuestions(newQs);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return;
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 10), 0);
    const quizId = `quiz-${Date.now()}`;
    app.addQuiz({ id: quizId, chapterId, subjectId, title, description, questions, mode, totalMarks });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: mode === "chapter-test" ? "test" : "quiz", order, refId: quizId });
    onClose();
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: `q-${Date.now()}`,
      type: "mcq",
      prompt: { text: "" },
      options: [{ text: "Option A" }, { text: "Option B" }],
      correctIndex: 0,
      marks: 10
    }]);
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-amber-200 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-slate-900">{mode === "chapter-test" ? "Test" : "Quiz"} - Add {label}</h4>
        <div className="text-sm font-bold border border-amber-200 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg">Total Marks: {questions.reduce((sum, q) => sum + (q.marks || 10), 0)}</div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-sm font-bold text-slate-600 block mb-1">Title *</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={`${label} title`} autoFocus /></div>
            <div><label className="text-sm font-bold text-slate-600 block mb-1">Description</label><input value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Brief description" /></div>
          </div>
        </div>

        {questions.map((q, idx) => (
          <QuestionEditorCard 
            key={q.id} 
            question={q} 
            index={idx} 
            onChange={(uq) => handleApplyQuestionUpdate(idx, uq)}
            onDelete={() => handleDeleteQuestion(idx)}
            uploadFile={uploadFile}
            uploading={uploading}
          />
        ))}

        <button onClick={handleAddQuestion} disabled={uploading} className="w-full py-4 bg-indigo-50 text-indigo-600 border border-indigo-200 border-dashed rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">+ Add Question</button>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={questions.length === 0 || uploading || !title.trim()} className={`px-4 py-2 rounded-lg font-bold text-sm ${questions.length > 0 && !uploading && title.trim() ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400"}`}>Save {label} ({questions.length} questions)</button>
        <button onClick={() => { onClose(); setQuestions([]); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
      </div>
    </div>
  );
}

function QuestionEditorCard({ question, index, onChange, onDelete, uploadFile, uploading }: {
  question: Question; index: number; onChange: (q: Question) => void; onDelete: () => void;
  uploadFile: (f: File, folder: string) => Promise<string | null>; uploading: boolean;
}) {
  const updateType = (newType: QuestionType) => {
    const defaultMarks = question.marks || 10;
    const base = { ...question, type: newType, marks: defaultMarks };
    if (newType === "mcq") { base.options = base.options || [{text:""},{text:""}]; base.correctIndex = base.correctIndex || 0; }
    if (newType === "multi-correct") { base.options = base.options || [{text:""},{text:""}]; base.correctIndices = base.correctIndices || []; base.partialMarking = base.partialMarking ?? false; }
    if (newType === "fill-blank") { base.correctAnswer = base.correctAnswer || ""; }
    if (newType === "matching" || newType === "drag-drop") {
       base.leftItems = base.leftItems || [{text:"Item A"},{text:"Item B"}];
       base.rightItems = base.rightItems || [{text:"Target A"},{text:"Target B"}];
       base.correctPairs = base.correctPairs || {"Item A": "Target A", "Item B": "Target B"};
    }
    if (newType === "theory") { base.sampleAnswer = base.sampleAnswer || ""; }
    onChange(base);
  };

  const handleMediaUpload = async (file: File, field: 'imageUrl'|'videoUrl'|'audioUrl', target: 'prompt' | number = 'prompt') => {
    const url = await uploadFile(file, 'quiz-media');
    if (!url) return;
    if (target === 'prompt') {
      onChange({ ...question, prompt: { ...question.prompt, [field]: url } });
    } else {
      const opts = [...(question.options || [])];
      opts[target] = { ...opts[target], [field]: url };
      onChange({ ...question, options: opts });
    }
  };

  const removeMedia = (field: keyof MediaBlock, target: 'prompt' | number = 'prompt') => {
    if (target === 'prompt') {
      onChange({ ...question, prompt: { ...question.prompt, [field]: undefined } });
    } else {
       const opts = [...(question.options || [])];
       opts[target] = { ...opts[target], [field]: undefined };
       onChange({ ...question, options: opts });
    }
  };

  return (
    <div className="bg-white border-2 border-slate-100 shadow-sm rounded-2xl p-6 relative group transition-all hover:border-indigo-100 mb-4 focus-within:border-indigo-300 focus-within:shadow-md">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex gap-2">
        <button onClick={onDelete} className="text-red-500 hover:text-white hover:bg-red-500 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4 items-center">
        <div className="col-span-12 md:col-span-7 flex items-center gap-3">
          <span className="text-sm font-black text-slate-300 w-4">{index + 1}.</span>
          <input 
            value={question.prompt.text || ""} 
            onChange={e => onChange({ ...question, prompt: { ...question.prompt, text: e.target.value } })}
            placeholder="Question Text" 
            className="w-full text-lg font-bold border-b-2 border-slate-100 focus:border-indigo-400 bg-transparent py-1.5 outline-none transition-colors" 
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <select value={question.type} onChange={e => updateType(e.target.value as QuestionType)} className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 text-sm font-bold text-slate-700 bg-slate-50 focus:border-indigo-400 outline-none">
            <option value="mcq">Multiple Choice</option>
            <option value="multi-correct">Checkboxes</option>
            <option value="fill-blank">Fill in Blank</option>
            <option value="matching">Matching</option>
            <option value="drag-drop">Drag Drop</option>
            <option value="theory">Theory (Long Answer)</option>
          </select>
        </div>
        <div className="col-span-12 md:col-span-2 flex items-center gap-2">
           <label className="text-xs font-bold text-slate-400">Marks:</label>
           <input type="number" min="0" value={question.marks || 0} onChange={e => onChange({ ...question, marks: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 text-sm font-bold text-indigo-600 bg-indigo-50 focus:border-indigo-400 outline-none" title="Marks" />
        </div>
      </div>

      <div className="mb-5 flex gap-2 pl-7">
        <label className="text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer text-slate-600 font-bold transition-colors">
          {uploading ? "..." : "🖼 Add Image"} <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleMediaUpload(e.target.files[0], 'imageUrl')} />
        </label>
        <label className="text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer text-slate-600 font-bold transition-colors">
          {uploading ? "..." : "🎵 Add Audio"} <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && handleMediaUpload(e.target.files[0], 'audioUrl')} />
        </label>
        <label className="text-xs bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer text-slate-600 font-bold transition-colors">
          {uploading ? "..." : "🎥 Add Video"} <input type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleMediaUpload(e.target.files[0], 'videoUrl')} />
        </label>
      </div>

      {(question.prompt.imageUrl || question.prompt.audioUrl || question.prompt.videoUrl) && (
        <div className="flex gap-4 mb-5 ml-7 p-3 bg-slate-50 rounded-xl border border-slate-100">
          {question.prompt.imageUrl && <div className="relative group/media"><img src={question.prompt.imageUrl} alt="" className="h-20 rounded-lg object-cover" /><button onClick={() => removeMedia('imageUrl')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover/media:opacity-100 font-bold">x</button></div>}
          {question.prompt.audioUrl && <div className="relative group/media"><audio src={question.prompt.audioUrl} controls className="h-10" /><button onClick={() => removeMedia('audioUrl')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover/media:opacity-100 font-bold">x</button></div>}
          {question.prompt.videoUrl && <div className="relative group/media"><video src={question.prompt.videoUrl} className="h-20 rounded-lg object-cover" /><button onClick={() => removeMedia('videoUrl')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover/media:opacity-100 font-bold">x</button></div>}
        </div>
      )}

      <div className="border-t border-slate-100 pt-5 ml-7">
        { /* Type specifics */ }
        {(question.type === "mcq" || question.type === "multi-correct") && (
          <div className="space-y-3">
            {question.type === "multi-correct" && (
               <div className="mb-3 flex flex-col gap-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                 <label className="text-sm font-bold text-indigo-900 mb-1">Grading Logic</label>
                 <select 
                   value={question.gradingRule?.mode || (question.partialMarking ? "linear" : "all-or-nothing")} 
                   onChange={e => {
                     const mode = e.target.value as "all-or-nothing" | "jee-style" | "linear";
                     if (mode === "all-or-nothing") onChange({ ...question, partialMarking: false, gradingRule: { mode } });
                     else onChange({ ...question, partialMarking: true, gradingRule: { mode, partialMarks: 1, penaltyMarks: 1 } });
                   }}
                   className="w-full px-3 py-2 rounded-lg border border-indigo-200 text-sm bg-white focus:border-indigo-400 outline-none font-medium"
                 >
                   <option value="all-or-nothing">All or Nothing (Full pts only if perfectly correct)</option>
                   <option value="jee-style">JEE Style (Partial sum if no wrong options selected, flat penalty otherwise)</option>
                   <option value="linear">Linear (+Pts per correct option, -Pts per wrong option)</option>
                 </select>

                 {(question.gradingRule?.mode === "jee-style" || question.gradingRule?.mode === "linear" || (question.partialMarking && !question.gradingRule)) && (
                   <div className="grid grid-cols-2 gap-3 mt-2">
                     <div>
                       <label className="text-xs font-bold text-indigo-700 block mb-1">Points per correct option (+)</label>
                       <input type="number" min="0" step="any" value={question.gradingRule?.partialMarks !== undefined ? question.gradingRule.partialMarks : 1} onChange={e => {
                           onChange({ ...question, gradingRule: { ...question.gradingRule!, mode: question.gradingRule?.mode || "linear", partialMarks: parseFloat(e.target.value) || 0 } })
                       }} className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 text-sm outline-none bg-white" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-indigo-700 block mb-1">{question.gradingRule?.mode === "jee-style" ? "Flat Penalty if ANY wrong (-)" : "Penalty per wrong option (-)"}</label>
                       <input type="number" min="0" step="any" value={question.gradingRule?.penaltyMarks !== undefined ? question.gradingRule.penaltyMarks : (question.gradingRule?.mode === "jee-style" ? 1 : 0)} onChange={e => {
                           onChange({ ...question, gradingRule: { ...question.gradingRule!, mode: question.gradingRule?.mode || "linear", penaltyMarks: parseFloat(e.target.value) || 0 } })
                       }} className="w-full px-3 py-1.5 rounded-lg border border-indigo-200 text-sm outline-none bg-white" />
                     </div>
                   </div>
                 )}
               </div>
            )}
            {(question.options || []).map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-3 group/opt">
                {question.type === "mcq" ? (
                  <input type="radio" name={`corr-${question.id}`} checked={question.correctIndex === oIdx} onChange={() => onChange({ ...question, correctIndex: oIdx })} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                ) : (
                  <input type="checkbox" checked={(question.correctIndices || []).includes(oIdx)} onChange={() => {
                     const curr = question.correctIndices || [];
                     onChange({ ...question, correctIndices: curr.includes(oIdx) ? curr.filter(i => i !== oIdx) : [...curr, oIdx] })
                  }} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                )}
                <div className="flex-1 flex bg-slate-50 border-2 border-slate-100 rounded-lg overflow-hidden focus-within:border-indigo-400 transition-colors">
                  <input value={opt.text || ""} onChange={e => {
                    const newOpts = [...(question.options || [])];
                    newOpts[oIdx] = { ...newOpts[oIdx], text: e.target.value };
                    onChange({ ...question, options: newOpts });
                  }} className="flex-1 px-4 py-2 text-sm bg-transparent outline-none" placeholder={`Option ${oIdx + 1}`} />
                  
                  {opt.imageUrl && <div className="p-1"><img src={opt.imageUrl} alt="" className="h-8 rounded" /></div>}
                  
                  <label className="flex items-center justify-center px-3 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors" title="Add Image to Option">
                     🖼 <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleMediaUpload(e.target.files[0], 'imageUrl', oIdx)} />
                  </label>
                </div>
                
                <button onClick={() => {
                  const newOpts = [...(question.options || [])];
                  newOpts.splice(oIdx, 1);
                  let newIdx = question.correctIndex || 0;
                  if (question.type === "mcq" && newIdx === oIdx) newIdx = 0;
                  if (question.type === "mcq" && newIdx > oIdx) newIdx -= 1;
                  
                  let newIndices = [...(question.correctIndices || [])];
                  if (question.type === "multi-correct") {
                     newIndices = newIndices.filter(i => i !== oIdx).map(i => i > oIdx ? i - 1 : i);
                  }
                  onChange({ ...question, options: newOpts, correctIndex: newIdx, correctIndices: newIndices });
                }} className="text-slate-400 hover:text-red-500 px-2 py-2 opacity-0 group-hover/opt:opacity-100 transition-all font-bold" title="Remove Option">✕</button>
              </div>
            ))}
            <button onClick={() => onChange({ ...question, options: [...(question.options || []), { text: "" }] })} className="text-sm text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 mt-2"><span>+</span> Add Option</button>
          </div>
        )}

        {question.type === "fill-blank" && (
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <label className="text-sm font-bold text-slate-700 block mb-2">Correct Answer (Exact Match)</label>
             <input value={question.correctAnswer || ""} onChange={e => onChange({ ...question, correctAnswer: e.target.value })} className="w-full px-4 py-3 rounded-lg border-2 border-slate-100 text-base font-medium focus:border-indigo-400 outline-none" placeholder="Enter the exact answer" />
           </div>
        )}

        {(question.type === "matching" || question.type === "drag-drop") && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">Left Items (comma separated)</label>
                 <input value={(question.leftItems || []).map(i => i.text).join(", ")} onChange={e => {
                    const parts = e.target.value.split(",");
                    onChange({ ...question, leftItems: parts.map(t => ({text:t.trim()})) })
                 }} className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 text-sm outline-none focus:border-indigo-400" placeholder="Apple, Banana, Car" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 mb-1 block">Right Items / Targets (comma separated)</label>
                 <input value={(question.rightItems || []).map(i => i.text).join(", ")} onChange={e => {
                    const parts = e.target.value.split(",");
                    onChange({ ...question, rightItems: parts.map(t => ({text:t.trim()})) })
                 }} className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 text-sm outline-none focus:border-indigo-400" placeholder="Fruit, Fruit, Vehicle" />
               </div>
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500 mb-1 flex justify-between items-center">
                 <span>Correct Mapping Configuration (JSON)</span>
               </label>
               <input value={JSON.stringify(question.correctPairs || {})} onChange={e => {
                  try { const parsed = JSON.parse(e.target.value); onChange({ ...question, correctPairs: parsed }); } catch (e) {}
               }} className="w-full px-3 py-2 rounded-lg border-2 border-slate-100 text-sm font-mono bg-slate-100 focus:bg-white focus:border-indigo-400 outline-none" placeholder='{"Apple":"Fruit", "Banana":"Fruit"}' />
             </div>
          </div>
        )}

        {question.type === "theory" && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <label className="text-sm font-bold text-slate-700 block mb-2">Reference Answer / Grading Rubric</label>
             <textarea value={question.sampleAnswer || ""} onChange={e => onChange({ ...question, sampleAnswer: e.target.value })} className="w-full px-4 py-3 rounded-lg border-2 border-slate-100 text-sm font-medium focus:border-indigo-400 outline-none h-24 resize-y mb-3" placeholder="What the student should roughly cover..." />
             <div className="flex items-center gap-2">
               <label className="text-xs font-bold text-slate-500">Suggested Max Word Count:</label>
               <input type="number" min="0" value={question.maxWords || ""} onChange={e => onChange({ ...question, maxWords: e.target.value ? parseInt(e.target.value) : undefined })} className="w-24 px-3 py-1.5 rounded-lg border-2 border-slate-100 text-sm outline-none focus:border-indigo-400" placeholder="e.g. 250" />
             </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 ml-7">
         <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-1 border-2 border-transparent focus-within:border-indigo-200 transition-colors">
            <span className="text-lg p-2 opacity-50">💡</span>
            <input value={question.explanation || ""} onChange={e => onChange({ ...question, explanation: e.target.value })} className="w-full bg-transparent py-2.5 text-sm outline-none font-medium text-slate-700 placeholder:text-slate-400" placeholder="Add answer feedback / explanation (shows after they submit)" />
         </div>
      </div>
    </div>
  );
}
