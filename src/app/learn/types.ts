// ============================================================
// Saral School - Core Type Definitions
// ============================================================

// --- User & Auth ---

export type AgeGroup = "kids" | "explorer" | "scholar";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthdate: string; // ISO date string
  avatarIndex: number;
  ageGroup: AgeGroup;
  parentPin: string;
  createdAt: string;
  assignedSemester?: number; // 1-18, overrides age-based placement
  themePreference?: "light" | "dark"; // User preference for Scholar mode
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  users: User[]; // Multi-child support
}

// --- Subjects & Content ---

export interface Subject {
  id: string;
  name: string;
  icon: string; // emoji
  color: string; // tailwind color class
  semesters: Semester[];
}

export interface Semester {
  id: string;
  subjectId: string;
  number: number; // 1-18
  title: string; // e.g., "Semester 1"
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  semesterId: string;
  subjectId: string;
  title: string;
  order: number;
  contentItems: ContentItem[];
}

// --- Chapter Content Items (ordered) ---

export type ContentType = "video" | "notes" | "quiz" | "test" | "formula-sheet";

export interface ContentItem {
  id: string;
  chapterId: string;
  type: ContentType;
  order: number;
  // Reference to the actual content by ID
  refId: string;
}

export interface VideoLecture {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  description: string;
  videoUrl?: string;
  youtubeUrl?: string;
  duration?: string;
}

export interface ChapterNotes {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  content: string; // markdown or plain text
  pdfUrl?: string; // Appended for PDF support
}

export interface FormulaSheet {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  content: string; // markdown or plain text with formulas
}

// Student's personal notes on a video
export interface StudentNote {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  timestamp?: number;
  createdAt: string;
}

// --- Media & Quiz System ---

// Universal media container — any field can hold text, image, audio, video, or all together
export interface MediaBlock {
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export type QuestionType = "mcq" | "multi-correct" | "fill-blank" | "drag-drop" | "matching" | "theory";

export interface GradingRule {
  mode: "all-or-nothing" | "jee-style" | "linear";
  partialMarks?: number;   // +X per correct option (for jee-style or linear)
  penaltyMarks?: number;   // -Y for selecting wrong options (flat for jee, per-option for linear)
}

// Unified question interface that covers ALL question types
export interface UniversalQuestion {
  id: string;
  type: QuestionType;
  prompt: MediaBlock;            // The question itself (text + optional media)
  explanation?: string;

  // MCQ / Multi-correct
  options?: MediaBlock[];        // Each option can have text/image/audio/video
  correctIndex?: number;         // For MCQ (single correct)
  correctIndices?: number[];     // For multi-correct

  // Fill-in-the-blank
  correctAnswer?: string;
  acceptableAnswers?: string[];

  // Matching / Drag-Drop
  leftItems?: MediaBlock[];
  rightItems?: MediaBlock[];
  correctPairs?: Record<string, string>; // Maps left text → right text

  // Extended Google-Forms style options
  points?: number;               // Points awarded for a fully correct answer (default 10)
  partialMarking?: boolean;      // Legacy: For multi-correct: if true, award partial points
  gradingRule?: GradingRule;     // Advanced grading configuration for multi-correct

  // Theory / Long-answer
  sampleAnswer?: string;         // Reference answer shown after submission
  maxWords?: number;
}

// Backward-compatible aliases
export type Question = UniversalQuestion;

// Legacy type aliases kept for import compatibility
export type MCQQuestion = UniversalQuestion;
export type FillBlankQuestion = UniversalQuestion;
export type MatchingQuestion = UniversalQuestion;
export type DragDropQuestion = UniversalQuestion;

// Migration helper: converts old question format to UniversalQuestion
export function migrateQuestion(q: any): UniversalQuestion {
  // Already in new format
  if (q.prompt) return q as UniversalQuestion;
  
  // Old format: had `question: string` and `imageUrl?: string`
  const base: UniversalQuestion = {
    id: q.id,
    type: q.type,
    prompt: { text: q.question, imageUrl: q.imageUrl },
    explanation: q.explanation,
  };

  switch (q.type) {
    case "mcq":
      base.options = (q.options || []).map((o: string) => ({ text: o }));
      base.correctIndex = q.correctIndex;
      break;
    case "fill-blank":
      base.correctAnswer = q.correctAnswer;
      base.acceptableAnswers = q.acceptableAnswers;
      break;
    case "matching":
      base.leftItems = (q.leftItems || []).map((t: string) => ({ text: t }));
      base.rightItems = (q.rightItems || []).map((t: string) => ({ text: t }));
      base.correctPairs = q.correctPairs;
      break;
    case "drag-drop":
      base.leftItems = (q.items || []).map((t: string) => ({ text: t }));
      base.rightItems = (q.targets || []).map((t: string) => ({ text: t }));
      base.correctPairs = q.correctMapping;
      break;
  }
  return base;
}

export interface Quiz {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  description: string;
  questions: UniversalQuestion[];
  mode: "quiz" | "chapter-test" | "brain-game";
  totalPoints: number;
}

// --- Gamification ---

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned: boolean;
  earnedAt?: string;
}

export interface GamificationState {
  points: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: Badge[];
  completedQuizzes: string[];
  completedVideos: string[];
}

// --- Progress ---

export interface QuizAttempt {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpentSeconds: number;
}

export interface SubjectProgress {
  subjectId: string;
  userId: string;
  completedVideos: string[];
  completedChapters: string[];
  quizAttempts: QuizAttempt[];
  lastAccessedAt: string;
}

export interface UserProgress {
  userId: string;
  subjectProgress: SubjectProgress[];
}

// --- Admin ---

export interface AdminContent {
  subjects: Subject[];
  videos: VideoLecture[];
  quizzes: Quiz[];
  chapterNotes: ChapterNotes[];
  formulaSheets: FormulaSheet[];
  studentNotes: StudentNote[];
}

// --- Scoreboard ---

export interface ScoreboardEntry {
  userId: string;
  name: string;
  avatarIndex: number;
  points: number;
  rank: number;
}

// --- Helpers ---

export function getAgeGroup(birthdate: string, assignedSemester?: number): AgeGroup {
  // If a parent has explicitly assigned a semester, base the UI on the semester level
  // Semester 1-4: Kids (approx grade K-2)
  // Semester 5-10: Explorer (approx grade 3-6)
  // Semester 11+: Scholar (approx grade 7+)
  if (assignedSemester !== undefined) {
    if (assignedSemester <= 4) return "kids";
    if (assignedSemester <= 10) return "explorer";
    return "scholar";
  }

  // Otherwise fallback to age-based routing
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age < 6) return "kids";
  if (age < 10) return "explorer";
  return "scholar";
}

export function getAgeFromBirthdate(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const AVATARS = ["🦊", "🐼", "🦁", "🐸", "🐱", "🐶", "🦄", "🐰"];

export const CONTENT_TYPE_INFO: Record<ContentType, { label: string; icon: string; color: string }> = {
  "video": { label: "Video Lecture", icon: "🎬", color: "indigo" },
  "notes": { label: "Notes", icon: "📝", color: "emerald" },
  "quiz": { label: "Quiz", icon: "❓", color: "amber" },
  "test": { label: "Test", icon: "📋", color: "red" },
  "formula-sheet": { label: "Formula Sheet", icon: "📐", color: "violet" },
};

// Generate 18 semesters for a subject
export function generateSemesters(subjectId: string): Semester[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `${subjectId}-sem-${i + 1}`,
    subjectId,
    number: i + 1,
    title: `Semester ${i + 1}`,
    chapters: [],
  }));
}
