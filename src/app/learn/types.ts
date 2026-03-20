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

// --- Quiz & Questions ---

export type QuestionType = "mcq" | "fill-blank" | "drag-drop" | "matching";

export interface MCQQuestion {
  type: "mcq";
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface FillBlankQuestion {
  type: "fill-blank";
  id: string;
  question: string;
  imageUrl?: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation?: string;
}

export interface DragDropQuestion {
  type: "drag-drop";
  id: string;
  question: string;
  imageUrl?: string;
  items: string[];
  targets: string[];
  correctMapping: Record<string, string>;
  explanation?: string;
}

export interface MatchingQuestion {
  type: "matching";
  id: string;
  question: string;
  imageUrl?: string;
  leftItems: string[];
  rightItems: string[];
  correctPairs: Record<string, string>;
  explanation?: string;
}

export type Question = MCQQuestion | FillBlankQuestion | DragDropQuestion | MatchingQuestion;

export interface Quiz {
  id: string;
  chapterId: string;
  subjectId: string;
  title: string;
  description: string;
  questions: Question[];
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
