// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import db from '../../../../db/db';

export async function GET() {
  const stmt = db.prepare('SELECT * FROM Task');
  const tasks = stmt.all();
  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(request: Request) {
  const { description, start_date, stimated_days, state, employee, project } = await request.json();
  const stmt = db.prepare('INSERT INTO Task (description, start_date, stimated_days, state, employee, project) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(description, start_date, stimated_days, state, employee, project);
  const taskId = (db.prepare('SELECT last_insert_rowid() as id').get() as { id: number }).id;
  const newTask = db.prepare('SELECT * FROM Task WHERE id = ?').get(taskId);
  return NextResponse.json(newTask, { status: 201 });
}
