import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanup() {
  try {
    // Terminate all idle-in-transaction and active connections that are stuck
    const { rows } = await pool.query(`
      SELECT pid, state, query, now() - query_start AS duration
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
        AND state IN ('idle in transaction', 'active')
        AND now() - query_start > interval '5 seconds'
    `);

    console.log(`Found ${rows.length} stuck connections:`);
    for (const row of rows) {
      console.log(`  PID=${row.pid} state=${row.state} duration=${row.duration} query=${row.query?.substring(0, 80)}`);
      await pool.query('SELECT pg_terminate_backend($1)', [row.pid]);
      console.log(`  -> Terminated PID ${row.pid}`);
    }

    // Also terminate all idle in transaction
    const { rows: idleRows } = await pool.query(`
      SELECT pid, state FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
        AND state = 'idle in transaction'
    `);
    for (const row of idleRows) {
      await pool.query('SELECT pg_terminate_backend($1)', [row.pid]);
      console.log(`  -> Terminated idle-in-transaction PID ${row.pid}`);
    }

    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

cleanup();
