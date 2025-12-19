import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        sessions: {
          include: {
            takes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST new project
export async function POST(request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        name: body.name,
        client: body.client || null,
        status: body.status,
        notes: body.notes || null,
        startDate: body.startDate
      }
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}