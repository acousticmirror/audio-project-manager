import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST new take
export async function POST(request) {
  try {
    const body = await request.json();
    const take = await prisma.take.create({
      data: {
        sessionId: body.sessionId,
        name: body.name,
        versionNumber: body.versionNumber || null,
        notes: body.notes || null,
        status: body.status,
        fileUrl: body.fileUrl || null
      }
    });
    return NextResponse.json(take);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create take' }, { status: 500 });
  }
}