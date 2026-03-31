import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull()
});

export const semesters = sqliteTable('semesters', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  number: integer('number').notNull(),
  title: text('title').notNull()
});

export const chapters = sqliteTable('chapters', {
  id: text('id').primaryKey(),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  order: integer('order').notNull()
});

// Poly-morphic content items to keep chapter ordering
export const contentItems = sqliteTable('content_items', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'video', 'notes', 'quiz', 'test', 'formula-sheet'
  order: integer('order').notNull(),
  refId: text('ref_id').notNull(), // ID of the referenced video, note, or quiz
});

export const videos = sqliteTable('videos', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  youtubeUrl: text('youtube_url'),
  duration: text('duration')
});

export const chapterNotes = sqliteTable('chapter_notes', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content'),
  pdfUrl: text('pdf_url')
});

export const formulaSheets = sqliteTable('formula_sheets', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content')
});

export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  mode: text('mode').notNull(), // 'quiz', 'chapter-test', 'brain-game'
  totalPoints: integer('total_points').notNull(),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  prompt: text('prompt', { mode: 'json' }).notNull(), // JSON MediaBlock
  explanation: text('explanation'),
  options: text('options', { mode: 'json' }), // JSON Array of MediaBlock
  correctIndex: integer('correct_index'),
  correctIndices: text('correct_indices', { mode: 'json' }), // JSON Array of numbers
  correctAnswer: text('correct_answer'),
  acceptableAnswers: text('acceptable_answers', { mode: 'json' }), // JSON Array of strings
  leftItems: text('left_items', { mode: 'json' }), // JSON Array of MediaBlock
  rightItems: text('right_items', { mode: 'json' }), // JSON Array of MediaBlock
  correctPairs: text('correct_pairs', { mode: 'json' }), // JSON Record<string, string>
  sampleAnswer: text('sample_answer'),
  maxWords: integer('max_words'),
});

export const studentNotes = sqliteTable('student_notes', {
  id: text('id').primaryKey(),
  videoId: text('video_id').notNull(),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  timestamp: integer('timestamp'),
  createdAt: text('created_at').notNull()
});
