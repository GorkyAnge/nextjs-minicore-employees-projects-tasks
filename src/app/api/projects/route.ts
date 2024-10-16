// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../../db/db';

export async function GET() {
  const stmt = db.prepare('SELECT * FROM Projects');
  const projects = stmt.all();
  return NextResponse.json(projects, { status: 200 });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO Projects (id, name) VALUES (?, ?)');
  stmt.run(id, name);
  return NextResponse.json({ id, name }, { status: 201 });
}
