import { query } from '../database/connection.js';

function noteSelect() {
  return `
    SELECT
      notes.id,
      notes.title,
      notes.content,
      notes.is_favorite,
      notes.created_at,
      notes.updated_at
    FROM notes
  `;
}

export async function listOwnedNotes(userId, limit, offset) {
  const { rows } = await query(
    `${noteSelect()}
     WHERE notes.owner_id = $1
     ORDER BY notes.is_favorite DESC, notes.updated_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
}

export async function countOwnedNotes(userId) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS total FROM notes WHERE owner_id = $1',
    [userId]
  );
  return rows[0].total;
}

export async function createNote(ownerId, title, content) {
  const { rows } = await query(
    `INSERT INTO notes (owner_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, is_favorite, created_at, updated_at`,
    [ownerId, title, content]
  );
  return rows[0] || null;
}

export async function findAccessibleNoteById(noteId, userId) {
  const { rows } = await query(
    `${noteSelect()}
     LEFT JOIN note_shares ON note_shares.note_id = notes.id AND note_shares.user_id = $2
     WHERE notes.id = $1 AND (notes.owner_id = $2 OR note_shares.user_id = $2)
     LIMIT 1`,
    [noteId, userId]
  );
  return rows[0] || null;
}

export async function findOwnedNoteById(noteId, ownerId) {
  const { rows } = await query(
    'SELECT id FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, ownerId]
  );
  return rows[0] || null;
}

export async function updateOwnedNote(noteId, ownerId, title, content) {
  const { rows } = await query(
    `UPDATE notes
     SET title = $3, content = $4
     WHERE id = $1 AND owner_id = $2
     RETURNING id, title, content, is_favorite, created_at, updated_at`,
    [noteId, ownerId, title, content]
  );
  return rows[0] || null;
}

export async function deleteOwnedNote(noteId, ownerId) {
  const { rowCount } = await query(
    'DELETE FROM notes WHERE id = $1 AND owner_id = $2',
    [noteId, ownerId]
  );
  return rowCount > 0;
}

export async function shareNoteWithUser(noteId, userId) {
  await query(
    `INSERT INTO note_shares (note_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (note_id, user_id) DO NOTHING`,
    [noteId, userId]
  );
}

export async function setOwnedNoteFavorite(noteId, ownerId, isFavorite) {
  const { rows } = await query(
    `UPDATE notes
     SET is_favorite = $3
     WHERE id = $1 AND owner_id = $2
     RETURNING id, title, content, is_favorite, created_at, updated_at`,
    [noteId, ownerId, isFavorite]
  );
  return rows[0] || null;
}

export async function searchAccessibleNotes(searchText, userId) {
  const { rows } = await query(
    `${noteSelect()}
     LEFT JOIN note_shares ON note_shares.note_id = notes.id AND note_shares.user_id = $2
     WHERE (notes.owner_id = $2 OR note_shares.user_id = $2)
       AND to_tsvector('english', notes.title || ' ' || notes.content) @@ plainto_tsquery('english', $1)
     ORDER BY ts_rank(to_tsvector('english', notes.title || ' ' || notes.content), plainto_tsquery('english', $1)) DESC,
              notes.updated_at DESC
     LIMIT 50`,
    [searchText, userId]
  );
  return rows;
}

export async function getSharedNotes(userId) {
  const { rows } = await query(
    `SELECT notes.id, notes.title, users.email as sender_email
     FROM notes
     JOIN note_shares ON note_shares.note_id = notes.id
     JOIN users ON users.id = notes.owner_id
     WHERE note_shares.user_id = $1
     ORDER BY note_shares.shared_at DESC`,
    [userId]
  );
  return rows;
}