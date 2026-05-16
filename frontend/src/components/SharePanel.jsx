import { Share2 } from 'lucide-react';

export default function SharePanel({ selectedNote, shareEmail, setShareEmail, onShare, isLoading }) {
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
            disabled={isLoading}
          />
        </label>
        <button type="submit" disabled={!selectedNote?.id || isLoading}>
          <Share2 size={17} />
          {isLoading ? 'Sharing...' : 'Share note'}
        </button>
      </form>
      {selectedNote?.id && <p className="note-id">ID: {selectedNote.id}</p>}
    </aside>
  );
}
