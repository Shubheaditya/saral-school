import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, userStats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.id, id));
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const statsResult = await db.select().from(userStats).where(eq(userStats.userId, id));
    
    return NextResponse.json({
      ...userResult[0],
      stats: statsResult.length > 0 ? statsResult[0] : null
    });
  } catch (error) {
    console.error('API Error checking user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, phone, name, birthdate, avatarIndex, ageGroup, parentPin, assignedSemester } = body;

    if (!id || !name || !birthdate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert user
    await db.insert(users).values({
      id,
      email: email || '',
      phone: phone || '',
      name,
      birthdate,
      avatarIndex: avatarIndex || 0,
      ageGroup: ageGroup || 'kids',
      parentPin: parentPin || '1234',
      assignedSemester: assignedSemester || 1,
      createdAt: new Date().toISOString()
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        name,
        birthdate,
        avatarIndex: avatarIndex || 0,
        ageGroup: ageGroup || 'kids',
        parentPin: parentPin || '1234',
        assignedSemester: assignedSemester || 1
      }
    });

    // Verify stats exist
    const statsResult = await db.select().from(userStats).where(eq(userStats.userId, id));
    if (statsResult.length === 0) {
      await db.insert(userStats).values({
        id,
        userId: id,
        points: 0,
        gems: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
