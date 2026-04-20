import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import * as schema from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

// POST — Save a new quiz attempt
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, quizId, subjectId, score, totalMarks, percentage, answers } = body;

    if (!userId || !quizId) {
      return NextResponse.json({ error: 'userId and quizId are required' }, { status: 400 });
    }

    const id = `qa-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    await db.insert(schema.quizAttempts).values({
      id,
      userId,
      quizId,
      subjectId: subjectId || '',
      score: score ?? 0,
      totalMarks: totalMarks ?? 0,
      percentage: percentage ?? 0,
      answers: answers ?? {},
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Quiz attempt save error:', error);
    return NextResponse.json({ error: 'Failed to save quiz attempt' }, { status: 500 });
  }
}

// GET — Fetch quiz attempts for a user, optionally filtered
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const subjectId = searchParams.get('subjectId');

    let attempts;
    if (subjectId) {
      attempts = await db.select().from(schema.quizAttempts)
        .where(and(eq(schema.quizAttempts.userId, userId), eq(schema.quizAttempts.subjectId, subjectId)));
    } else {
      attempts = await db.select().from(schema.quizAttempts)
        .where(eq(schema.quizAttempts.userId, userId));
    }

    // Compute analytics
    const totalAttempts = attempts.length;
    const avgPercentage = totalAttempts > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts) : 0;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalMaxMarks = attempts.reduce((sum, a) => sum + a.totalMarks, 0);

    // Group by subject
    const bySubject: Record<string, { attempts: number; avgPercentage: number; totalScore: number; totalMarks: number }> = {};
    for (const a of attempts) {
      if (!bySubject[a.subjectId]) {
        bySubject[a.subjectId] = { attempts: 0, avgPercentage: 0, totalScore: 0, totalMarks: 0 };
      }
      bySubject[a.subjectId].attempts++;
      bySubject[a.subjectId].totalScore += a.score;
      bySubject[a.subjectId].totalMarks += a.totalMarks;
    }
    for (const subId of Object.keys(bySubject)) {
      const group = bySubject[subId];
      group.avgPercentage = group.totalMarks > 0 ? Math.round((group.totalScore / group.totalMarks) * 100) : 0;
    }

    return NextResponse.json({
      attempts,
      analytics: {
        totalAttempts,
        avgPercentage,
        totalScore,
        totalMaxMarks,
        bySubject,
      },
    });
  } catch (error: any) {
    console.error('Quiz attempts fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 });
  }
}
