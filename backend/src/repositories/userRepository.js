import { query } from '../database/connection.js';

export async function createUser(email, passwordHash) {
  return query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
    [email, passwordHash]
  );
}

export async function findUserByEmail(email) {
  const { rows } = await query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await query(
    'SELECT id, email FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}