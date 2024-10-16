// app/api/employees/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '../../../../db/db';

export async function GET() {
  const stmt = db.prepare('SELECT * FROM Employee');
  const employees = stmt.all();
  return NextResponse.json(employees, { status: 200 });
}

export async function POST(request: Request) {
  const { name, surname } = await request.json();
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO Employee (id, name, surname) VALUES (?, ?, ?)');
  stmt.run(id, name, surname);
  return NextResponse.json({ id, name, surname }, { status: 201 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name, surname } = await request.json();
  const stmt = db.prepare('UPDATE Employee SET name = ?, surname = ? WHERE id = ?');
  stmt.run(name, surname, params.id);
  const updatedStmt = db.prepare('SELECT * FROM Employee WHERE id = ?');
  const updatedEmployee = updatedStmt.get(params.id);
  return NextResponse.json(updatedEmployee, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('DELETE FROM Employee WHERE id = ?');
  stmt.run(params.id);
  return NextResponse.json({ message: 'Employee deleted' }, { status: 200 });
}
