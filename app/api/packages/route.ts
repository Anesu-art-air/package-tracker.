import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const packages = db.prepare('SELECT * FROM packages ORDER BY sent_date DESC').all();
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const stmt = db.prepare('INSERT INTO packages (recipient, destination, item, sent_date) VALUES (?, ?, ?, ?)');
  stmt.run(body.recipient, body.destination, body.item, body.sent_date);
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const stmt = db.prepare('UPDATE packages SET recipient = ?, destination = ?, item = ?, sent_date = ? WHERE id = ?');
  stmt.run(body.recipient, body.destination, body.item, body.sent_date, body.id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const stmt = db.prepare('DELETE FROM packages WHERE id = ?');
    stmt.run(id);
  }
  
  return NextResponse.json({ success: true });
}