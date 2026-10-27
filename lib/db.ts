import { createClient } from '@libsql/client';

// This connects to your free cloud database instead of your computer
const db = createClient({
  url: process.env.TURSO_DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});

// Create the table if it doesn't exist yet
db.execute(`
  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient TEXT NOT NULL,
    destination TEXT NOT NULL,
    item TEXT NOT NULL,
    sent_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).catch(console.error);

export default db;