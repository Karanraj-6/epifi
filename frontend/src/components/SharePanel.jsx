import { Share2 } from 'lucide-react';

export default function SharePanel({ selectedNote, shareEmail, setShareEmail, onShare }) {
  return (
    <aside className="share-panel">
      <h2>Share</h2>
      <form onSubmit={onShare}>
        <label>
          Recipient email
          <input
            type="email"
            value={shareEmail}
            onChange={(event) => setShareEmail(event.target.value)}
            placeholder="friend@example.com"
          />
        </label>
        <button type="submit" disabled={!selectedNote?.id}>
          <Share2 size={17} />
          Share note
        </button>
      </form>
      {selectedNote?.id && <p className="note-id">ID: {selectedNote.id}</p>}
    </aside>
  );
}
