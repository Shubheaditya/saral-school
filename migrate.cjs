// One-time migration script to create quiz_attempts table
const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Creating quiz_attempts table...');
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quiz_id TEXT NOT NULL,
      subject_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_marks INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      answers TEXT,
      completed_at TEXT NOT NULL
    )
  `);

  console.log('✅ quiz_attempts table created successfully!');
  process.exit(0);
}

migrate().catch(e => { console.error('Migration failed:', e); process.exit(1); });
