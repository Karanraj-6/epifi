import { Save, Share2, X } from 'lucide-react';

export default function Editor({ draft, setDraft, selectedNote, onSave, onShare, onCloseShared }) {
  return (
    <section className="editor">
      <div className="editor-toolbar">
        <span>{selectedNote?.id ? 'Editing note' : 'Draft note'}</span>
        <div className="toolbar-actions">
          {selectedNote?.id && (
            <button className="icon-button" onClick={onShare} title="Share note">
              <Share2 size={18} />
            </button>
          )}
          {selectedNote?.shared && (
            <button className="icon-button" onClick={onCloseShared} title="Close shared note">
              <X size={18} />
            </button>
          )}
          <button className="save-button" onClick={onSave}>
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      <input
        className="title-input"
        value={draft.title}
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        placeholder="Title"
        maxLength={120}
      />
      <textarea
        value={draft.content}
        onChange={(event) => setDraft({ ...draft, content: event.target.value })}
        placeholder="Start writing..."
      />
    </section>
  );
}
