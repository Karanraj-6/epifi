import { Plus, Star, Trash2, Calendar, FileText } from 'lucide-react';

export default function NoteList({ 
  notes, 
  selectedId, 
  onSelect, 
  onNew, 
  onToggleFavorite, 
  onDelete, 
  currentPage, 
  totalCount, 
  onPageChange,
  isLoading
}) {
  const totalPages = Math.ceil(totalCount / 3);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-note-premium" onClick={onNew}>
          <Plus size={20} />
          <span>New note</span>
        </button>
      </div>

      <div className="note-list-scroll">
        {notes.length === 0 && !isLoading ? (
          <div className="empty-state-container">
            <FileText size={40} />
            <p>Your workspace is empty. Create your first note!</p>
          </div>
        ) : (
          <div className="note-list-items">
            {notes.map((note) => (
              <article
                key={note.id}
                className={`note-card-premium ${selectedId === note.id ? 'selected' : ''}`}
                onClick={() => onSelect(note)}
              >
                <div className="note-card-content">
                  <div className="note-card-header">
                    <h3>{note.title || 'Untitled Note'}</h3>
                    <button
                      className={`favorite-toggle ${note.is_favorite ? 'active' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(note);
                      }}
                    >
                      <Star size={16} fill={note.is_favorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  <p className="note-excerpt">
                    {note.content.replace(/<[^>]*>/g, '') || 'No content yet...'}
                  </p>
                  
                  <div className="note-card-footer">
                    <div className="note-date">
                      <Calendar size={14} />
                      <span>{new Date(note.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <button
                      className="delete-note-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(note);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-numbered">
          <button 
            className="page-nav-btn" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            &laquo;
          </button>
          
          {pages.map(p => (
            <button
              key={p}
              className={`page-number ${p === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              disabled={isLoading}
            >
              {p}
            </button>
          ))}

          <button 
            className="page-nav-btn" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            &raquo;
          </button>
        </div>
      )}
    </aside>
  );
}
