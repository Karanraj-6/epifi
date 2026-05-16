import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 5000
});

async function test() {
  console.log('Attempting connection...');
  try {
    const { rows } = await pool.query('SELECT NOW() as now, current_database() as db');
    console.log('Connected! Time:', rows[0].now, 'DB:', rows[0].db);

    // Check for any stuck connections
    const { rows: actRows } = await pool.query(`
      SELECT pid, state, query, now() - query_start AS duration
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
    `);
    console.log(`Active connections (excluding self): ${actRows.length}`);
    for (const r of actRows) {
      console.log(`  PID=${r.pid} state="${r.state}" dur=${r.duration} q="${r.query?.substring(0, 60)}"`);
    }

    // Check tables
    const { rows: tables } = await pool.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `);
    console.log('Tables:', tables.map(t => t.tablename).join(', '));

    // Try a simple insert and read
    console.log('Testing user insert...');
    const email = `conntest${Date.now()}@test.com`;
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, 'testhash']);
    console.log('Insert succeeded');

    const { rows: users } = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    console.log('Read back user:', users[0]);

    // Clean up
    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    console.log('Cleanup done');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

test();
