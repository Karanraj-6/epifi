import { Plus, Star, Trash2 } from 'lucide-react';

export default function NoteList({ notes, selectedId, onSelect, onNew, onToggleFavorite, onDelete }) {
  return (
    <aside className="sidebar">
      <button className="new-note" onClick={onNew}>
        <Plus size={18} />
        New note
      </button>

      <div className="note-list">
        {notes.map((note) => (
          <article
            key={note.id}
            className={`note-card ${selectedId === note.id ? 'selected' : ''}`}
            onClick={() => onSelect(note)}
          >
            <div className="note-card-top">
              <h2>{note.title}</h2>
              <button
                className={`icon-button ${note.is_favorite ? 'active-star' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(note);
                }}
                title={note.is_favorite ? 'Remove favorite' : 'Mark favorite'}
              >
                <Star size={17} />
              </button>
            </div>
            <p>{note.content}</p>
            <div className="note-card-bottom">
              <span>{new Date(note.updated_at).toLocaleDateString()}</span>
              <button
                className="icon-button danger"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(note);
                }}
                title="Delete note"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}

        {notes.length === 0 && <p className="empty-state">No notes yet.</p>}
      </div>
    </aside>
  );
}
