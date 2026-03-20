"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../learn/contexts/AppContext";
import {
  Subject, Semester, Chapter, ContentItem, ContentType,
  VideoLecture, Quiz, Question, QuestionType, ChapterNotes, FormulaSheet,
  generateSemesters, CONTENT_TYPE_INFO,
} from "../../learn/types";
import { supabase } from "../../../lib/supabase";

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
            <span className="text-2xl">🔧</span>
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
  const [name, setName] = useState(""); const [icon, setIcon] = useState("📘"); const [color, setColor] = useState("indigo");

  const handleAdd = () => {
    if (!name.trim()) return;
    const id = `sub-${Date.now()}`;
    addSubject({ id, name, icon, color, semesters: generateSemesters(id) });
    setName(""); setIcon("📘"); setShowForm(false);
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
          <span className="text-4xl block mb-2">📁</span>
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
                  <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-xs">▲</button>
                  <button onClick={() => handleMoveDown(idx)} disabled={idx === items.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-xs">▼</button>
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
      const fileName = `videos/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('saral_files').upload(fileName, file);
      if (data) {
        finalVideoUrl = supabase.storage.from('saral_files').getPublicUrl(fileName).data.publicUrl;
      } else {
        console.error("Video upload failed:", error);
      }
    }

    const videoId = `vid-${Date.now()}`;
    app.addVideo({ id: videoId, chapterId, subjectId, title, description, videoUrl: finalVideoUrl || undefined, duration: duration || undefined });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: "video", order, refId: videoId });
    setUploading(false);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 mb-4">
      <h4 className="font-bold text-slate-900 mb-4">🎬 Add Video Lecture</h4>
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
            <label className="text-sm font-bold text-slate-600 block mb-1">Paste Video Link</label>
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
      const fileName = `notes/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('saral_files').upload(fileName, file);
      if (data) {
        finalPdfUrl = supabase.storage.from('saral_files').getPublicUrl(fileName).data.publicUrl;
      } else {
        console.error("PDF upload failed:", error);
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
      <h4 className="font-bold text-slate-900 mb-4">📝 Add Notes</h4>
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
          {file && <p className="text-xs text-emerald-600 font-bold mt-1">✓ Document Selected: {file.name}</p>}
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
      <h4 className="font-bold text-slate-900 mb-4">📐 Add Formula Sheet</h4>
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

  // Question builder
  const [qType, setQType] = useState<QuestionType>("mcq");
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qFillAnswer, setQFillAnswer] = useState("");
  const [qMatchLeft, setQMatchLeft] = useState("");
  const [qMatchRight, setQMatchRight] = useState("");
  const [qExplanation, setQExplanation] = useState("");

  const addQuestion = () => {
    if (!qText.trim()) return;
    let question: Question;
    switch (qType) {
      case "mcq":
        question = { type: "mcq", id: `q-${Date.now()}`, question: qText, options: [...qOptions], correctIndex: qCorrectIdx, explanation: qExplanation || undefined };
        break;
      case "fill-blank":
        question = { type: "fill-blank", id: `q-${Date.now()}`, question: qText, correctAnswer: qFillAnswer, explanation: qExplanation || undefined };
        break;
      case "matching":
        const left = qMatchLeft.split(",").map(s => s.trim()).filter(Boolean);
        const right = qMatchRight.split(",").map(s => s.trim()).filter(Boolean);
        const pairs: Record<string, string> = {};
        left.forEach((l, i) => { if (right[i]) pairs[l] = right[i]; });
        question = { type: "matching", id: `q-${Date.now()}`, question: qText, leftItems: left, rightItems: right, correctPairs: pairs, explanation: qExplanation || undefined };
        break;
      case "drag-drop":
        const items = qMatchLeft.split(",").map(s => s.trim()).filter(Boolean);
        const targets = qMatchRight.split(",").map(s => s.trim()).filter(Boolean);
        const mapping: Record<string, string> = {};
        items.forEach((item, i) => { if (targets[i]) mapping[item] = targets[i]; });
        question = { type: "drag-drop", id: `q-${Date.now()}`, question: qText, items, targets, correctMapping: mapping, explanation: qExplanation || undefined };
        break;
    }
    setQuestions([...questions, question]);
    setQText(""); setQOptions(["", "", "", ""]); setQCorrectIdx(0); setQFillAnswer(""); setQMatchLeft(""); setQMatchRight(""); setQExplanation("");
  };

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return;
    const quizId = `quiz-${Date.now()}`;
    app.addQuiz({ id: quizId, chapterId, subjectId, title, description, questions, mode, totalPoints: questions.length * 10 });
    app.addContentItem(subjectId, semesterId, chapterId, {
      id: `ci-${Date.now()}`, chapterId,
      type: mode === "chapter-test" ? "test" : "quiz",
      order, refId: quizId,
    });
    onClose();
  };

  const typeIcon = mode === "chapter-test" ? "📋" : "❓";

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-amber-200 mb-4">
      <h4 className="font-bold text-slate-900 mb-4">{typeIcon} Add {label}</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={`${label} title`} autoFocus />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Brief description" />
          </div>
        </div>

        {/* Question builder */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h5 className="font-bold text-slate-900 mb-3">Questions ({questions.length})</h5>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Type</label>
              <select value={qType} onChange={e => setQType(e.target.value as QuestionType)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                <option value="mcq">Multiple Choice</option>
                <option value="fill-blank">Fill in the Blank</option>
                <option value="matching">Matching</option>
                <option value="drag-drop">Drag and Drop</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Explanation (optional)</label>
              <input value={qExplanation} onChange={e => setQExplanation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Shown after answering" />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-sm font-bold text-slate-600 block mb-1">Question Text *</label>
            <input value={qText} onChange={e => setQText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Enter question" />
          </div>

          {qType === "mcq" && (
            <div className="space-y-2 mb-3">
              <label className="text-sm font-bold text-slate-600">Options (select correct)</label>
              {qOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={qCorrectIdx === i} onChange={() => setQCorrectIdx(i)} />
                  <input value={opt} onChange={e => { const o = [...qOptions]; o[i] = e.target.value; setQOptions(o); }} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                </div>
              ))}
            </div>
          )}
          {qType === "fill-blank" && (
            <div className="mb-3">
              <label className="text-sm font-bold text-slate-600 block mb-1">Correct Answer</label>
              <input value={qFillAnswer} onChange={e => setQFillAnswer(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
          )}
          {(qType === "matching" || qType === "drag-drop") && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">{qType === "matching" ? "Left Items" : "Items"} (comma-separated)</label>
                <input value={qMatchLeft} onChange={e => setQMatchLeft(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Dog, Cat, Duck" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">{qType === "matching" ? "Right Items" : "Targets"} (matching order)</label>
                <input value={qMatchRight} onChange={e => setQMatchRight(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="Bark, Meow, Quack" />
              </div>
            </div>
          )}

          <button onClick={addQuestion} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">+ Add Question</button>

          {questions.length > 0 && (
            <div className="mt-3 space-y-1">
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 rounded px-2 py-0.5 uppercase">{q.type}</span>
                  <span className="text-slate-700 flex-1 truncate">{q.question}</span>
                  <button onClick={() => setQuestions(questions.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs font-bold">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} disabled={questions.length === 0} className={`px-4 py-2 rounded-lg font-bold text-sm ${questions.length > 0 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"}`}>
            Save {label} ({questions.length} questions)
          </button>
          <button onClick={() => { onClose(); setQuestions([]); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}
