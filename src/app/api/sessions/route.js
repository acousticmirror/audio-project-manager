import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST new session
export async function POST(request) {
  try {
    const body = await request.json();
    const session = await prisma.session.create({
      data: {
        projectId: body.projectId,
        date: body.date,
        duration: body.duration || null,
        engineerNotes: body.engineerNotes || null,
        gearUsed: body.gearUsed || null
      }
    });
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}