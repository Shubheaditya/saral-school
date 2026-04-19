"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../learn/contexts/AppContext";
import {
  Subject, Semester, Chapter, ContentItem, ContentType,
  VideoLecture, Quiz, Question, QuestionType, ChapterNotes, FormulaSheet,
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
            <div className="w-8 h-8 rounded overflow-hidden shrink-0">
               <img src="/logo.png" alt="Saral School Logo" className="object-contain w-full h-full" />
            </div>
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
                <button onClick={item.onClick} className="text-rose-600 hover:text-rose-800 font-bold">
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
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700">+ Add Subject</button>
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
            <div key={subject.id} onClick={() => onOpen(subject.id)} className="bg-white rounded-xl p-5 border border-slate-200 text-left hover:border-rose-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{subject.icon}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSubject(subject.id); }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >Delete</button>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
              <p className="text-sm text-slate-400">{subject.semesters.length} semesters &middot; {totalChapters} chapters</p>
              <span className="text-rose-500 text-sm font-bold mt-2 block">Open &rarr;</span>
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
              className="bg-white rounded-xl p-4 border border-slate-200 text-center hover:border-rose-300 hover:shadow-md transition-all"
            >
              <p className="text-2xl font-black text-rose-600 mb-1">{sem.number}</p>
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
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700">+ Add Chapter</button>
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
          <span className="text-4xl block mb-2">ðŸ“‚</span>
          <p className="text-slate-500">No chapters yet. Click &quot;Add Chapter&quot; to create your first chapter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {semester.chapters.sort((a, b) => a.order - b.order).map((chapter, idx) => (
            <div
              key={chapter.id}
              onClick={() => onOpen(chapter.id)}
              className="w-full bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-4 text-left hover:border-rose-300 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-lg font-black text-rose-600 shrink-0">
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
              <span className="text-rose-400 font-bold text-sm">Open &rarr;</span>
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
          <button onClick={() => setShowAddMenu(!showAddMenu)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700">
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
          <span className="text-4xl block mb-2">ðŸ“¦</span>
          <p className="text-slate-500 mb-3">No content yet. Add videos, notes, quizzes, tests, or formula sheets.</p>
          <button onClick={() => setShowAddMenu(true)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm">+ Add Content</button>
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
    <div className="bg-white rounded-xl p-6 border-2 border-rose-200 mb-4">
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
            <label className="text-sm font-bold text-slate-600 block mb-1">ðŸ”— YouTube / Video Link</label>
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" placeholder="https://youtube.com/..." disabled={!!file} />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-600 block mb-1">OR Upload Video File (.mp4)</label>
            <input type="file" accept="video/mp4,video/webm" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-rose-50 file:text-rose-700 font-bold hover:file:bg-rose-100" disabled={!!videoUrl} />
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
          {file && <p className="text-xs text-emerald-600 font-bold mt-1">Document Selected: {file.name}</p>}
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
// Blank question template
function blankQuestion() {
  return {
    id: `q-${Date.now()}-${Math.random()}`,
    type: "mcq" as QuestionType,
    prompt: { text: "" } as { text?: string; imageUrl?: string; audioUrl?: string; videoUrl?: string },
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }] as { text?: string; imageUrl?: string }[],
    correctIndex: 0 as number,
    correctIndices: [] as number[],
    correctAnswer: "" as string,
    explanation: "" as string,
    markingScheme: { maxMarks: 1, negativeMarks: 0, multiCorrectMode: "all-or-nothing" as "all-or-nothing" | "partial" | "any-wrong-full-negative" },
    sampleAnswer: "" as string,
    maxWords: undefined as number | undefined,
    leftItems: undefined as { text?: string }[] | undefined,
    rightItems: undefined as { text?: string }[] | undefined,
    correctPairs: undefined as Record<string, string> | undefined,
    _promptImageFile: null as File | null,
    _promptAudioFile: null as File | null,
    _promptVideoFile: null as File | null,
    _optionFiles: [null, null, null, null] as (File | null)[],
    _matchLeft: "" as string,
    _matchRight: "" as string,
  };
}

function AddQuizForm({ subjectId, semesterId, chapterId, order, mode, label, app, onClose }: {
  subjectId: string; semesterId: string; chapterId: string; order: number;
  mode: "quiz" | "chapter-test"; label: string;
  app: ReturnType<typeof useApp>; onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draft, setDraft] = useState(blankQuestion());

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to upload");
      return (await res.json()).url;
    } catch (e: any) { alert(`Upload failed: ${e.message}`); return null; }
  };

  const openNewQuestion = () => { setDraft(blankQuestion()); setEditingIdx(null); setBuilderOpen(true); };

  const openEditQuestion = (idx: number) => {
    const q = questions[idx];
    const base = blankQuestion();
    setDraft({
      ...base,
      ...q,
      markingScheme: (q.markingScheme || base.markingScheme) as ReturnType<typeof blankQuestion>["markingScheme"],
      _promptImageFile: null, _promptAudioFile: null, _promptVideoFile: null,
      _optionFiles: (q.options || []).map((): (File | null) => null),
      _matchLeft: (q.leftItems || []).map((i: { text?: string }) => i.text ?? "").filter(Boolean).join(", "),
      _matchRight: (q.rightItems || []).map((i: { text?: string }) => i.text ?? "").filter(Boolean).join(", "),
    } as ReturnType<typeof blankQuestion>);

    setEditingIdx(idx);
    setBuilderOpen(true);
  };

  const deleteQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) { setBuilderOpen(false); setEditingIdx(null); }
  };

  const addOption = () => setDraft(prev => ({ ...prev, options: [...(prev.options || []), { text: "" }], _optionFiles: [...(prev._optionFiles || []), null] }));

  const removeOption = (idx: number) => setDraft(prev => ({
    ...prev,
    options: (prev.options || []).filter((_, i) => i !== idx),
    _optionFiles: (prev._optionFiles || []).filter((_, i) => i !== idx),
    correctIndex: prev.correctIndex === idx ? 0 : (prev.correctIndex || 0) > idx ? (prev.correctIndex || 0) - 1 : prev.correctIndex,
    correctIndices: (prev.correctIndices || []).filter(i => i !== idx).map(i => i > idx ? i - 1 : i),
  }));

  const toggleCorrectIdx = (idx: number) => setDraft(prev => ({
    ...prev,
    correctIndices: (prev.correctIndices || []).includes(idx)
      ? (prev.correctIndices || []).filter(i => i !== idx)
      : [...(prev.correctIndices || []), idx],
  }));

  const commitQuestion = async () => {
    if (!draft.prompt.text?.trim()) { alert("Please enter question text."); return; }
    if ((draft.type === "mcq" || draft.type === "multi-correct") && !(draft.options || []).some(o => o.text?.trim())) {
      alert("Please add at least one option with text."); return;
    }
    setUploading(true);

    const q: Question = {
      id: draft.id, type: draft.type,
      prompt: { ...draft.prompt },
      explanation: draft.explanation || undefined,
      markingScheme: draft.markingScheme,
      options: (draft.type === "mcq" || draft.type === "multi-correct") ? [...(draft.options || [])] : undefined,
      correctIndex: draft.type === "mcq" ? draft.correctIndex : undefined,
      correctIndices: draft.type === "multi-correct" ? [...(draft.correctIndices || [])] : undefined,
      correctAnswer: draft.type === "fill-blank" ? draft.correctAnswer : undefined,
      sampleAnswer: draft.type === "theory" ? draft.sampleAnswer : undefined,
      maxWords: draft.type === "theory" ? draft.maxWords : undefined,
    };

    if (draft._promptImageFile) q.prompt = { ...q.prompt, imageUrl: (await uploadFile(draft._promptImageFile)) || q.prompt.imageUrl };
    if (draft._promptAudioFile) q.prompt = { ...q.prompt, audioUrl: (await uploadFile(draft._promptAudioFile)) || q.prompt.audioUrl };
    if (draft._promptVideoFile) q.prompt = { ...q.prompt, videoUrl: (await uploadFile(draft._promptVideoFile)) || q.prompt.videoUrl };

    if ((draft.type === "mcq" || draft.type === "multi-correct") && draft._optionFiles) {
      const opts = [...(q.options || [])];
      for (let i = 0; i < draft._optionFiles.length; i++) {
        if (draft._optionFiles[i]) {
          const url = await uploadFile(draft._optionFiles[i]!);
          if (url && opts[i]) opts[i] = { ...opts[i], imageUrl: url };
        }
      }
      q.options = opts;
    }

    if (draft.type === "matching" || draft.type === "drag-drop") {
      const left = draft._matchLeft.split(",").map(s => s.trim()).filter(Boolean);
      const right = draft._matchRight.split(",").map(s => s.trim()).filter(Boolean);
      const pairs: Record<string, string> = {};
      left.forEach((l, i) => { if (right[i]) pairs[l] = right[i]; });
      q.leftItems = left.map(t => ({ text: t }));
      q.rightItems = right.map(t => ({ text: t }));
      q.correctPairs = pairs;
    }

    setUploading(false);
    if (editingIdx !== null) {
      setQuestions(prev => prev.map((existing, i) => i === editingIdx ? q : existing));
    } else {
      setQuestions(prev => [...prev, q]);
    }
    setBuilderOpen(false);
    setEditingIdx(null);
  };

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return;
    const quizId = `quiz-${Date.now()}`;
    const totalMarks = questions.reduce((sum, q) => sum + (q.markingScheme?.maxMarks || 1), 0);
    app.addQuiz({ id: quizId, chapterId, subjectId, title, description, questions, mode, totalMarks, totalPoints: totalMarks });
    app.addContentItem(subjectId, semesterId, chapterId, { id: `ci-${Date.now()}`, chapterId, type: mode === "chapter-test" ? "test" : "quiz", order, refId: quizId });
    onClose();
  };

  const totalMarks = questions.reduce((sum, q) => sum + (q.markingScheme?.maxMarks || 1), 0);

  return (
    <div className="bg-white rounded-xl border-2 border-amber-200 mb-4 overflow-hidden animate-fade-in-up">
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
        <h4 className="font-bold text-slate-900 text-lg">{mode === "chapter-test" ? "Create Test" : "Create Quiz"}</h4>
        <p className="text-xs text-slate-500 mt-1">Build your {label} - add questions, set marks per question, and define correct answers</p>
      </div>
      <div className="p-6 space-y-5">
        {/* Title & Description */}
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-bold text-slate-600 block mb-1">Quiz Title *</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-400 transition-colors duration-150" placeholder="e.g. Chapter 3 Quiz" autoFocus /></div>
          <div><label className="text-sm font-bold text-slate-600 block mb-1">Description (optional)</label><input value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-400 transition-colors duration-150" placeholder="Brief description" /></div>
        </div>

        {/* Question List */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white">
            <span className="font-bold text-slate-800 text-sm">Questions ({questions.length}) | Total: {totalMarks} Marks</span>
            <button onClick={openNewQuestion} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors duration-150">+ Add Question</button>
          </div>
          {questions.length === 0 && !builderOpen && (
            <div className="px-4 py-8 text-center text-slate-400 text-sm"><p className="text-lg mb-1">No questions yet</p><p className="text-xs">Click "+ Add Question" to get started</p></div>
          )}
          {questions.length > 0 && (
            <div className="divide-y divide-slate-100 stagger-children">
              {questions.map((q, i) => (
                <div key={q.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 group animate-fade-in-up">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 uppercase flex-shrink-0">{q.type}</span>
                  <span className="text-slate-700 text-sm flex-1 truncate">{q.prompt.text || "(no text)"}</span>
                  <span className="text-xs font-bold text-slate-500 flex-shrink-0">{q.markingScheme?.maxMarks || 1}M{(q.markingScheme?.negativeMarks || 0) > 0 ? ` / -${q.markingScheme?.negativeMarks}` : ""}</span>
                  <button onClick={() => openEditQuestion(i)} className="text-rose-500 hover:text-rose-700 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-150 px-2 py-1 hover:bg-rose-50 rounded">Edit</button>
                  <button onClick={() => deleteQuestion(i)} className="text-red-400 hover:text-red-700 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-150 px-2 py-1 hover:bg-red-50 rounded">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Builder Panel */}
        {builderOpen && (
          <div className="border-2 border-rose-200 rounded-xl bg-rose-50/30 p-5 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-900">{editingIdx !== null ? `Editing Question ${editingIdx + 1}` : "New Question"}</h5>
              <button onClick={() => setBuilderOpen(false)} className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors duration-150">x Close</button>
            </div>

            {/* Question Type */}
            <div className="grid grid-cols-3 gap-2">
              {(["mcq", "multi-correct", "fill-blank", "matching", "drag-drop", "theory"] as QuestionType[]).map(t => (
                <button key={t} onClick={() => setDraft(prev => ({ ...prev, type: t }))}
                  className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all duration-150 text-center ${draft.type === t ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"}`}>
                  {t === "mcq" ? "Single Choice" : t === "multi-correct" ? "Multiple Correct" : t === "fill-blank" ? "Fill in Blank" : t === "matching" ? "Matching" : t === "drag-drop" ? "Drag & Drop" : "Long Answer"}
                </button>
              ))}
            </div>

            {/* Question Text */}
            <div>
              <label className="text-sm font-bold text-slate-600 block mb-1">Question Text *</label>
              <textarea value={draft.prompt.text || ""} onChange={e => setDraft(prev => ({ ...prev, prompt: { ...prev.prompt, text: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm h-20 resize-y focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Enter your question..." />
            </div>

            {/* Prompt Media */}
            <div className="p-3 bg-white rounded-lg border border-dashed border-slate-300">
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Attach Media (optional)</p>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-[10px] font-bold text-slate-400 block mb-1">Image</label><input type="file" accept="image/*" onChange={e => setDraft(prev => ({ ...prev, _promptImageFile: e.target.files?.[0] || null }))} className="w-full text-xs file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs" />{draft.prompt.imageUrl && !draft._promptImageFile && <p className="text-[10px] text-emerald-600 mt-0.5">Has image</p>}</div>
                <div><label className="text-[10px] font-bold text-slate-400 block mb-1">Audio</label><input type="file" accept="audio/*" onChange={e => setDraft(prev => ({ ...prev, _promptAudioFile: e.target.files?.[0] || null }))} className="w-full text-xs file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-violet-50 file:text-violet-700 file:text-xs" />{draft.prompt.audioUrl && !draft._promptAudioFile && <p className="text-[10px] text-emerald-600 mt-0.5">Has audio</p>}</div>
                <div><label className="text-[10px] font-bold text-slate-400 block mb-1">Video</label><input type="file" accept="video/*" onChange={e => setDraft(prev => ({ ...prev, _promptVideoFile: e.target.files?.[0] || null }))} className="w-full text-xs file:mr-1 file:py-0.5 file:px-2 file:rounded file:border-0 file:bg-amber-50 file:text-amber-700 file:text-xs" />{draft.prompt.videoUrl && !draft._promptVideoFile && <p className="text-[10px] text-emerald-600 mt-0.5">Has video</p>}</div>
              </div>
            </div>

            {/* MCQ / Multi-Correct Options */}
            {(draft.type === "mcq" || draft.type === "multi-correct") && (
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2">{draft.type === "mcq" ? "Options - Select ONE correct:" : "Options - Check ALL correct:"}</label>
                <div className="space-y-2">
                  {(draft.options || []).map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {draft.type === "mcq"
                        ? <input type="radio" name="correct" checked={draft.correctIndex === i} onChange={() => setDraft(prev => ({ ...prev, correctIndex: i }))} className="w-4 h-4 accent-rose-600 flex-shrink-0" />
                        : <input type="checkbox" checked={(draft.correctIndices || []).includes(i)} onChange={() => toggleCorrectIdx(i)} className="w-4 h-4 accent-rose-600 flex-shrink-0" />
                      }
                      <input value={opt.text || ""} onChange={e => { const opts = [...(draft.options || [])]; opts[i] = { ...opts[i], text: e.target.value }; setDraft(prev => ({ ...prev, options: opts })); }}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                      <input type="file" accept="image/*" onChange={e => { const files = [...(draft._optionFiles || [])]; files[i] = e.target.files?.[0] || null; setDraft(prev => ({ ...prev, _optionFiles: files })); }}
                        className="w-24 text-[10px] file:py-0.5 file:px-1 file:rounded file:border-0 file:bg-slate-100 file:text-slate-600 file:text-[10px]" title="Attach image" />
                      {opt.imageUrl && <span className="text-[10px] text-emerald-600 flex-shrink-0">img</span>}
                      {(draft.options || []).length > 2 && <button onClick={() => removeOption(i)} className="text-red-400 hover:text-red-600 text-sm font-bold px-1 flex-shrink-0">x</button>}
                    </div>
                  ))}
                </div>
                <button onClick={addOption} className="mt-2 text-xs text-rose-600 font-bold hover:text-rose-800">+ Add Option</button>
                {draft.type === "multi-correct" && (
                  <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <label className="text-xs font-bold text-rose-700 block mb-2">Multi-Correct Marking Mode</label>
                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="radio" name="mcMode" value="all-or-nothing" checked={(draft.markingScheme?.multiCorrectMode || "all-or-nothing") === "all-or-nothing"}
                          onChange={() => setDraft(prev => ({ ...prev, markingScheme: { ...prev.markingScheme, multiCorrectMode: "all-or-nothing" } }))}
                          className="mt-0.5 accent-rose-600 flex-shrink-0" />
                        <span className="text-xs text-rose-800">All-or-Nothing: Full marks only if ALL correct options are selected, else 0</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="radio" name="mcMode" value="partial" checked={draft.markingScheme?.multiCorrectMode === "partial"}
                          onChange={() => setDraft(prev => ({ ...prev, markingScheme: { ...prev.markingScheme, multiCorrectMode: "partial" } }))}
                          className="mt-0.5 accent-rose-600 flex-shrink-0" />
                        <span className="text-xs text-rose-800">Partial Marking: Marks per correct option, deduct per wrong option selected</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="radio" name="mcMode" value="any-wrong-full-negative" checked={draft.markingScheme?.multiCorrectMode === "any-wrong-full-negative"}
                          onChange={() => setDraft(prev => ({ ...prev, markingScheme: { ...prev.markingScheme, multiCorrectMode: "any-wrong-full-negative" } }))}
                          className="mt-0.5 accent-rose-600 flex-shrink-0" />
                        <span className="text-xs text-rose-800">Any Wrong = Full Negative: If any wrong option is selected, full negative marks are deducted</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {draft.type === "fill-blank" && (
              <div><label className="text-sm font-bold text-slate-600 block mb-1">Correct Answer *</label>
                <input value={draft.correctAnswer || ""} onChange={e => setDraft(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Exact correct answer" /></div>
            )}

            {(draft.type === "matching" || draft.type === "drag-drop") && (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-bold text-slate-600 block mb-1">{draft.type === "matching" ? "Left Items" : "Items"} (comma-separated)</label>
                  <input value={draft._matchLeft || ""} onChange={e => setDraft(prev => ({ ...prev, _matchLeft: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Dog, Cat, Duck" /></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">{draft.type === "matching" ? "Right Items" : "Targets"} (matching order)</label>
                  <input value={draft._matchRight || ""} onChange={e => setDraft(prev => ({ ...prev, _matchRight: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Bark, Meow, Quack" /></div>
              </div>
            )}

            {draft.type === "theory" && (
              <div className="space-y-3">
                <div><label className="text-sm font-bold text-slate-600 block mb-1">Sample / Reference Answer</label>
                  <textarea value={draft.sampleAnswer || ""} onChange={e => setDraft(prev => ({ ...prev, sampleAnswer: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm h-24 resize-y focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Model answer..." /></div>
                <div><label className="text-sm font-bold text-slate-600 block mb-1">Max Words (optional)</label>
                  <input type="number" value={draft.maxWords || ""} onChange={e => setDraft(prev => ({ ...prev, maxWords: parseInt(e.target.value) || undefined }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="e.g. 200" /></div>
              </div>
            )}

            <div><label className="text-sm font-bold text-slate-600 block mb-1">Explanation (shown after answering)</label>
              <input value={draft.explanation || ""} onChange={e => setDraft(prev => ({ ...prev, explanation: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-rose-400 transition-colors duration-150" placeholder="Why is this the correct answer?" /></div>

            {/* Marking Scheme */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
              <p className="text-sm font-bold text-emerald-800 mb-3">Marking Scheme</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-slate-600 block mb-1">Marks for Correct Answer</label>
                  <input type="number" min={0} step={0.5} value={draft.markingScheme?.maxMarks ?? 1}
                    onChange={e => setDraft(prev => ({ ...prev, markingScheme: { ...prev.markingScheme, maxMarks: parseFloat(e.target.value) || 1 } }))}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:border-emerald-500 bg-white transition-colors duration-150" /></div>
                <div><label className="text-xs font-bold text-slate-600 block mb-1">Negative Marks (enter as positive, e.g. 1)</label>
                  <input type="number" min={0} step={0.25} value={draft.markingScheme?.negativeMarks ?? 0}
                    onChange={e => setDraft(prev => ({ ...prev, markingScheme: { ...prev.markingScheme, negativeMarks: parseFloat(e.target.value) || 0 } }))}
                    className="w-full px-3 py-2 rounded-lg border border-emerald-200 text-sm focus:outline-none focus:border-emerald-500 bg-white transition-colors duration-150" /></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">{draft.markingScheme?.negativeMarks ? `Wrong answer deducts ${draft.markingScheme.negativeMarks} mark(s).` : "No negative marking for this question."}</p>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={commitQuestion} disabled={uploading} className="px-5 py-2 bg-rose-600 text-white rounded-lg font-bold text-sm hover:bg-rose-700 disabled:opacity-50 transition-colors duration-150">
                {uploading ? "Uploading Media..." : editingIdx !== null ? "Update Question" : "Add Question"}
              </button>
              <button onClick={() => { setBuilderOpen(false); setEditingIdx(null); }} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors duration-150">Cancel</button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <button onClick={handleSave} disabled={!title.trim() || questions.length === 0}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors duration-150 ${title.trim() && questions.length > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
            Save {label} ({questions.length} questions | {totalMarks} marks)
          </button>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors duration-150">Cancel</button>
        </div>
      </div>
    </div>
  );
}
