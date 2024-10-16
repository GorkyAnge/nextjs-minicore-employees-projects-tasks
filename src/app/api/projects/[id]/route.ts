// app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '../../../../../db/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('SELECT * FROM Projects WHERE id = ?');
  const project = stmt.get(params.id);
  return NextResponse.json(project, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name } = await request.json();
  const stmt = db.prepare('UPDATE Projects SET name = ? WHERE id = ?');
  stmt.run(name, params.id);
  const updatedStmt = db.prepare('SELECT * FROM Projects WHERE id = ?');
  const updatedProject = updatedStmt.get(params.id);
  return NextResponse.json(updatedProject, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('DELETE FROM Projects WHERE id = ?');
  stmt.run(params.id);
  return NextResponse.json({ message: 'Project deleted' }, { status: 200 });
}
