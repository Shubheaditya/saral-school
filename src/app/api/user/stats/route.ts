import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PUT endpoint to update user stats directly (e.g. adding points/gems)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, pointsToAdd, gemsToAdd, updateStreak } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch existing stats
    const statsResult = await db.select().from(userStats).where(eq(userStats.userId, userId));
    
    if (statsResult.length === 0) {
      return NextResponse.json({ error: 'Stats record not found' }, { status: 404 });
    }

    const currentStats = statsResult[0];
    
    let newStreak = currentStats.currentStreak;
    let newLongest = currentStats.longestStreak;
    
    if (updateStreak) {
      newStreak += 1;
      if (newStreak > newLongest) {
        newLongest = newStreak;
      }
    }

    await db.update(userStats)
      .set({
        points: currentStats.points + (pointsToAdd || 0),
        gems: currentStats.gems + (gemsToAdd || 0),
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: new Date().toISOString()
      })
      .where(eq(userStats.userId, userId));

    return NextResponse.json({ success: true, points: currentStats.points + (pointsToAdd || 0), gems: currentStats.gems + (gemsToAdd || 0), currentStreak: newStreak });
  } catch (error) {
    console.error('API Error updating stats:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}
