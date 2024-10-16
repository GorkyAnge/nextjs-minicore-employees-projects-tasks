// app/api/employees/[id]/route.ts
import { NextResponse } from 'next/server';
import db from '../../../../../db/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const stmt = db.prepare('SELECT * FROM Employee WHERE id = ?');
  const employee = stmt.get(params.id);
  return NextResponse.json(employee, { status: 200 });
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
