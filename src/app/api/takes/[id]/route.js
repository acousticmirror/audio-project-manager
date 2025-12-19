import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    // Await params in Next.js 16+
    const { id } = await params;
    const takeId = parseInt(id);
    
    const take = await prisma.take.findUnique({
      where: { id: takeId }
    });

    if (!take) {
      return NextResponse.json({ error: 'Take not found' }, { status: 404 });
    }

    if (take.fileUrl) {
      const filepath = join(process.cwd(), 'public', take.fileUrl);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    }

    await prisma.take.delete({
      where: { id: takeId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete take' }, { status: 500 });
  }
}