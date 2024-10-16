// app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '../../../../../db/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('SELECT * FROM Task WHERE id = ?');
  const task = stmt.get(params.id);
  return NextResponse.json(task, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('DELETE FROM Task WHERE id = ?');
  stmt.run(params.id);
  return NextResponse.json({ message: 'Task deleted' }, { status: 200 });
}
