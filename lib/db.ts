import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'packages.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient TEXT NOT NULL,
    destination TEXT NOT NULL,
    item TEXT NOT NULL,
    sent_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;