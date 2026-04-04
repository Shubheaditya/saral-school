import { Subject, Badge, ScoreboardEntry, Quiz, Question, Semester, Chapter } from "./types";

// ============================================================
// Helper to generate semesters with pre-populated chapters
// ============================================================

function makeSemester(subjectId: string, num: number, title: string, chapters: Omit<Chapter, "semesterId" | "subjectId">[]): Semester {
  const semId = `${subjectId}-sem-${num}`;
  return {
    id: semId,
    subjectId,
    number: num,
    title,
    chapters: chapters.map(c => ({ ...c, semesterId: semId, subjectId })),
  };
}

function emptyChapter(id: string, title: string, order: number): Omit<Chapter, "semesterId" | "subjectId"> {
  return { id, title, order, contentItems: [] };
}

// ============================================================
// MATH — Semester 1-3 with sample chapters (subtopics)
// ============================================================

const mathSemesters: Semester[] = [
  makeSemester("math", 1, "Numbers & Counting", [
    emptyChapter("math-ch-1-1", "Counting 1 to 100", 1),
    emptyChapter("math-ch-1-2", "Place Value (Ones & Tens)", 2),
    emptyChapter("math-ch-1-3", "Comparing Numbers", 3),
    emptyChapter("math-ch-1-4", "Number Patterns", 4),
  ]),
  makeSemester("math", 2, "Addition & Subtraction", [
    emptyChapter("math-ch-2-1", "Addition of Single Digits", 1),
    emptyChapter("math-ch-2-2", "Subtraction of Single Digits", 2),
    emptyChapter("math-ch-2-3", "Word Problems (Add & Subtract)", 3),
    emptyChapter("math-ch-2-4", "Carrying & Borrowing", 4),
  ]),
  makeSemester("math", 3, "Shapes & Geometry", [
    emptyChapter("math-ch-3-1", "Basic 2D Shapes", 1),
    emptyChapter("math-ch-3-2", "3D Shapes Around Us", 2),
    emptyChapter("math-ch-3-3", "Symmetry", 3),
  ]),
  makeSemester("math", 4, "Multiplication", [
    emptyChapter("math-ch-4-1", "Introduction to Multiplication", 1),
    emptyChapter("math-ch-4-2", "Times Tables (2-5)", 2),
    emptyChapter("math-ch-4-3", "Times Tables (6-10)", 3),
    emptyChapter("math-ch-4-4", "Multiplication Word Problems", 4),
  ]),
  makeSemester("math", 5, "Division", [
    emptyChapter("math-ch-5-1", "Introduction to Division", 1),
    emptyChapter("math-ch-5-2", "Division Facts", 2),
    emptyChapter("math-ch-5-3", "Long Division", 3),
  ]),
  makeSemester("math", 6, "Fractions & Decimals", [
    emptyChapter("math-ch-6-1", "What are Fractions?", 1),
    emptyChapter("math-ch-6-2", "Adding Fractions", 2),
    emptyChapter("math-ch-6-3", "Introduction to Decimals", 3),
  ]),
];

// Fill remaining semesters 7-18 as empty
for (let i = 7; i <= 18; i++) {
  mathSemesters.push({
    id: `math-sem-${i}`,
    subjectId: "math",
    number: i,
    title: `Semester ${i}`,
    chapters: [],
  });
}

// ============================================================
// SCIENCE — Semester 1-3 with sample chapters
// ============================================================

const scienceSemesters: Semester[] = [
  makeSemester("science", 1, "Living & Non-Living Things", [
    emptyChapter("sci-ch-1-1", "What is Living?", 1),
    emptyChapter("sci-ch-1-2", "Plants Around Us", 2),
    emptyChapter("sci-ch-1-3", "Animals & Their Habitats", 3),
    emptyChapter("sci-ch-1-4", "Non-Living Things", 4),
  ]),
  makeSemester("science", 2, "Our Body", [
    emptyChapter("sci-ch-2-1", "Body Parts & Organs", 1),
    emptyChapter("sci-ch-2-2", "Healthy Food & Nutrition", 2),
    emptyChapter("sci-ch-2-3", "Our Five Senses", 3),
  ]),
  makeSemester("science", 3, "Water & Air", [
    emptyChapter("sci-ch-3-1", "Water Cycle", 1),
    emptyChapter("sci-ch-3-2", "Properties of Water", 2),
    emptyChapter("sci-ch-3-3", "Air Around Us", 3),
  ]),
  makeSemester("science", 4, "Materials & Matter", [
    emptyChapter("sci-ch-4-1", "Solids, Liquids & Gases", 1),
    emptyChapter("sci-ch-4-2", "Natural vs Man-made Materials", 2),
  ]),
];

for (let i = 5; i <= 18; i++) {
  scienceSemesters.push({
    id: `science-sem-${i}`,
    subjectId: "science",
    number: i,
    title: `Semester ${i}`,
    chapters: [],
  });
}

// ============================================================
// ENGLISH — Semester 1-3 with sample chapters
// ============================================================

const englishSemesters: Semester[] = [
  makeSemester("english", 1, "Alphabets & Phonics", [
    emptyChapter("eng-ch-1-1", "Letters A-Z", 1),
    emptyChapter("eng-ch-1-2", "Vowels & Consonants", 2),
    emptyChapter("eng-ch-1-3", "Simple Words", 3),
  ]),
  makeSemester("english", 2, "Reading Basics", [
    emptyChapter("eng-ch-2-1", "Three Letter Words", 1),
    emptyChapter("eng-ch-2-2", "Sight Words", 2),
    emptyChapter("eng-ch-2-3", "Simple Sentences", 3),
    emptyChapter("eng-ch-2-4", "Reading Comprehension", 4),
  ]),
  makeSemester("english", 3, "Grammar Foundations", [
    emptyChapter("eng-ch-3-1", "Nouns", 1),
    emptyChapter("eng-ch-3-2", "Verbs", 2),
    emptyChapter("eng-ch-3-3", "Adjectives", 3),
  ]),
];

for (let i = 4; i <= 18; i++) {
  englishSemesters.push({
    id: `english-sem-${i}`,
    subjectId: "english",
    number: i,
    title: `Semester ${i}`,
    chapters: [],
  });
}

// ============================================================
// Other subjects — empty semesters for now
// ============================================================

function generateEmptySemesters(subjectId: string): Semester[] {
  return Array.from({ length: 18 }, (_, i) => ({
    id: `${subjectId}-sem-${i + 1}`,
    subjectId,
    number: i + 1,
    title: `Semester ${i + 1}`,
    chapters: [],
  }));
}

// ============================================================
// Default Subjects
// ============================================================

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    icon: "🔢",
    color: "indigo",
    semesters: mathSemesters,
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    color: "emerald",
    semesters: scienceSemesters,
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    color: "pink",
    semesters: englishSemesters,
  },
  {
    id: "social",
    name: "Social Science",
    icon: "🌍",
    color: "amber",
    semesters: generateEmptySemesters("social"),
  },
  {
    id: "logic",
    name: "Logical Reasoning",
    icon: "🧩",
    color: "violet",
    semesters: generateEmptySemesters("logic"),
  },
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    color: "cyan",
    semesters: generateEmptySemesters("tech"),
  },
];

// ============================================================
// Mock Quiz (sample for demonstration)
// ============================================================

export const MOCK_QUIZ_QUESTIONS: Question[] = [
  {
    type: "mcq",
    id: "q1",
    prompt: { text: "What is 5 + 3?" },
    options: [{ text: "6" }, { text: "7" }, { text: "8" }, { text: "9" }],
    correctIndex: 2,
    explanation: "5 + 3 = 8",
  },
  {
    type: "mcq",
    id: "q2",
    prompt: { text: "Which shape has 4 equal sides?" },
    options: [{ text: "Triangle" }, { text: "Square" }, { text: "Circle" }, { text: "Rectangle" }],
    correctIndex: 1,
    explanation: "A square has 4 equal sides.",
  },
  {
    type: "fill-blank",
    id: "q3",
    prompt: { text: "The sun rises in the ___." },
    correctAnswer: "east",
    acceptableAnswers: ["East", "EAST"],
    explanation: "The sun rises in the east.",
  },
  {
    type: "mcq",
    id: "q4",
    prompt: { text: "Which animal says 'Moo'?" },
    options: [{ text: "Dog" }, { text: "Cat" }, { text: "Cow" }, { text: "Bird" }],
    correctIndex: 2,
    explanation: "A cow says 'Moo'!",
  },
  {
    type: "matching",
    id: "q5",
    prompt: { text: "Match the animals with their sounds:" },
    leftItems: [{ text: "Dog" }, { text: "Cat" }, { text: "Duck" }],
    rightItems: [{ text: "Quack" }, { text: "Bark" }, { text: "Meow" }],
    correctPairs: { Dog: "Bark", Cat: "Meow", Duck: "Quack" },
    explanation: "Dogs bark, cats meow, and ducks quack!",
  },
];

export const MOCK_QUIZ: Quiz = {
  id: "mock-quiz-1",
  chapterId: "",
  subjectId: "math",
  title: "Quick Math Quiz",
  description: "Test your basic math skills!",
  questions: MOCK_QUIZ_QUESTIONS,
  mode: "quiz",
  totalPoints: 50,
  totalMarks: 50,
};

// ============================================================
// Default Badges
// ============================================================

export const DEFAULT_BADGES: Badge[] = [
  { id: "first-quiz", name: "Quiz Starter", description: "Complete your first quiz", icon: "🌟", requirement: "Complete 1 quiz", earned: false },
  { id: "five-quizzes", name: "Quiz Champion", description: "Complete 5 quizzes", icon: "🏆", requirement: "Complete 5 quizzes", earned: false },
  { id: "perfect-score", name: "Perfect Score", description: "Get 100% on any quiz", icon: "💯", requirement: "Score 100% on a quiz", earned: false },
  { id: "three-streak", name: "On Fire", description: "Maintain a 3-day streak", icon: "🔥", requirement: "3-day streak", earned: false },
  { id: "seven-streak", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "⚡", requirement: "7-day streak", earned: false },
  { id: "first-video", name: "Video Watcher", description: "Watch your first video lecture", icon: "📹", requirement: "Watch 1 video", earned: false },
  { id: "all-subjects", name: "Explorer", description: "Try all 6 subjects", icon: "🗺️", requirement: "Access all 6 subjects", earned: false },
  { id: "hundred-points", name: "Century", description: "Earn 100 points", icon: "💎", requirement: "Earn 100 points", earned: false },
];

// ============================================================
// Mock Scoreboard Data
// ============================================================

export const MOCK_SCOREBOARD: ScoreboardEntry[] = [
  { userId: "mock-1", name: "Aarav", avatarIndex: 0, points: 1250, rank: 1 },
  { userId: "mock-2", name: "Priya", avatarIndex: 3, points: 1100, rank: 2 },
  { userId: "mock-3", name: "Rahul", avatarIndex: 1, points: 980, rank: 3 },
  { userId: "mock-4", name: "Ananya", avatarIndex: 6, points: 870, rank: 4 },
  { userId: "mock-5", name: "Vikram", avatarIndex: 2, points: 750, rank: 5 },
  { userId: "mock-6", name: "Diya", avatarIndex: 7, points: 620, rank: 6 },
  { userId: "mock-7", name: "Arjun", avatarIndex: 4, points: 510, rank: 7 },
  { userId: "mock-8", name: "Meera", avatarIndex: 5, points: 430, rank: 8 },
];
