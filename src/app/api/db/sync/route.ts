import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import * as schema from '../../../../db/schema';
import { eq, inArray } from 'drizzle-orm';

// The GET endpoint pulls everything from Turso and builds the full nested tree for the UI
export async function GET() {
  try {
    const allSubjects = await db.select().from(schema.subjects);
    const allSemesters = await db.select().from(schema.semesters);
    const allChapters = await db.select().from(schema.chapters);
    const allContentItems = await db.select().from(schema.contentItems);
    const allVideos = await db.select().from(schema.videos);
    const allQuizzes = await db.select().from(schema.quizzes);
    const allQuestions = await db.select().from(schema.questions);
    const allNotes = await db.select().from(schema.chapterNotes);
    const allFormulas = await db.select().from(schema.formulaSheets);
    const allStudentNotes = await db.select().from(schema.studentNotes);

    // Build the nested tree
    const subjectsWithNesting = allSubjects.map((subject) => {
      const subjectSemesters = allSemesters.filter((s) => s.subjectId === subject.id);
      
      const semestersWithChapters = subjectSemesters.map((semester) => {
        const semesterChapters = allChapters.filter((c) => c.semesterId === semester.id);
        
        const chaptersWithItems = semesterChapters.map((chapter) => {
          const items = allContentItems.filter((i) => i.chapterId === chapter.id);
          return { ...chapter, contentItems: items.sort((a, b) => a.order - b.order) };
        });

        return { ...semester, chapters: chaptersWithItems.sort((a, b) => a.order - b.order) };
      });

      return { ...subject, semesters: semestersWithChapters };
    });

    // Rebuild Quizzes with their nested JSON Questions
    const quizzesWithQuestions = allQuizzes.map((quiz) => {
      const questions = allQuestions.filter((q) => q.quizId === quiz.id).map(q => ({
        ...q,
        // Drizzle handles JSON parsing automatically if configured, or manually if string
      }));
      return { ...quiz, questions };
    });

    const fullState = {
      subjects: subjectsWithNesting,
      videos: allVideos,
      quizzes: quizzesWithQuestions,
      chapterNotes: allNotes,
      formulaSheets: allFormulas,
      studentNotes: allStudentNotes,
    };

    return NextResponse.json(fullState);
  } catch (error) {
    console.error("Database sync GET error:", error);
    return NextResponse.json({ error: "Failed to fetch database state" }, { status: 500 });
  }
}

// Complex POST sync endpoint
// For simplicity in this massive migration, the client posts specific mutations
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    // --- Subject Ops ---
    if (action === "ADD_SUBJECT") {
      await db.insert(schema.subjects).values(payload.subject);
      // Insert semesters automatically
      if (payload.semesters && payload.semesters.length > 0) {
        await db.insert(schema.semesters).values(payload.semesters);
      }
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_SUBJECT") {
      await db.delete(schema.subjects).where(eq(schema.subjects.id, payload.id));
      return NextResponse.json({ success: true });
    }

    // --- Semester / Chapter Ops ---
    if (action === "ADD_CHAPTER") {
      await db.insert(schema.chapters).values(payload);
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_CHAPTER") {
      await db.delete(schema.chapters).where(eq(schema.chapters.id, payload.id));
      return NextResponse.json({ success: true });
    }

    // --- Content Items Ops ---
    if (action === "ADD_CONTENT_ITEM") {
      await db.insert(schema.contentItems).values(payload);
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_CONTENT_ITEM") {
      await db.delete(schema.contentItems).where(eq(schema.contentItems.id, payload.id));
      return NextResponse.json({ success: true });
    }
    
    // --- Videos Ops ---
    if (action === "ADD_VIDEO") {
      await db.insert(schema.videos).values(payload);
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_VIDEO") {
      await db.delete(schema.videos).where(eq(schema.videos.id, payload.id));
      return NextResponse.json({ success: true });
    }

    // --- Notes Ops ---
    if (action === "ADD_CHAPTER_NOTE") {
      await db.insert(schema.chapterNotes).values(payload);
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_CHAPTER_NOTE") {
      await db.delete(schema.chapterNotes).where(eq(schema.chapterNotes.id, payload.id));
      return NextResponse.json({ success: true });
    }

    // --- Formulas Ops ---
    if (action === "ADD_FORMULA_SHEET") {
      await db.insert(schema.formulaSheets).values(payload);
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_FORMULA_SHEET") {
      await db.delete(schema.formulaSheets).where(eq(schema.formulaSheets.id, payload.id));
      return NextResponse.json({ success: true });
    }

    // --- Quiz Ops ---
    if (action === "ADD_QUIZ") {
      const { quiz, questions } = payload;
      await db.insert(schema.quizzes).values(quiz);
      if (questions && questions.length > 0) {
        await db.insert(schema.questions).values(questions);
      }
      return NextResponse.json({ success: true });
    }
    if (action === "DELETE_QUIZ") {
      await db.delete(schema.quizzes).where(eq(schema.quizzes.id, payload.id));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Database sync POST error:", error);
    return NextResponse.json({ error: "Failed to persist to Turso" }, { status: 500 });
  }
}
