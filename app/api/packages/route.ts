import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const result = await db.execute('SELECT * FROM packages ORDER BY sent_date DESC');
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  await db.execute({
    sql: 'INSERT INTO packages (recipient, destination, item, sent_date) VALUES (?, ?, ?, ?)',
    args: [body.recipient, body.destination, body.item, body.sent_date],
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = await request.json();
  await db.execute({
    sql: 'UPDATE packages SET recipient = ?, destination = ?, item = ?, sent_date = ? WHERE id = ?',
    args: [body.recipient, body.destination, body.item, body.sent_date, body.id],
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    await db.execute({
      sql: 'DELETE FROM packages WHERE id = ?',
      args: [id],
    });
  }
  
  return NextResponse.json({ success: true });
}