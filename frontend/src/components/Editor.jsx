import { Save, Share2, Sparkles, X, RotateCcw } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function Editor({ draft, setDraft, selectedNote, onSave, onShare, onImprove, onUndoImprove, canUndo, onCloseShared, isLoading }) {
  return (
    <section className="editor">
      <div className="editor-header">
        <div className="editor-status">
          <div className={`status-dot ${selectedNote?.id ? 'active' : 'draft'}`}></div>
          <span>{isLoading ? 'Processing...' : (selectedNote?.id ? (selectedNote.shared ? 'Shared Note' : 'All changes saved') : 'New Draft')}</span>
        </div>
        <div className="editor-actions">
          <button className="ai-improve-btn" onClick={onImprove} title="Improve with AI" disabled={isLoading}>
            <Sparkles size={18} />
            <span>{isLoading ? 'Thinking...' : 'AI Improve'}</span>
          </button>
          
          {canUndo && (
            <button className="icon-action-btn" onClick={onUndoImprove} title="Undo AI improvement" disabled={isLoading}>
              <RotateCcw size={18} />
            </button>
          )}
          
          <div className="action-divider"></div>
          
          {selectedNote?.id && !selectedNote.shared && (
            <button className="icon-action-btn" onClick={onShare} title="Share note" disabled={isLoading}>
              <Share2 size={19} />
            </button>
          )}
          
          {selectedNote?.shared && (
            <button className="icon-action-btn danger-hover" onClick={onCloseShared} title="Close shared note" disabled={isLoading}>
              <X size={19} />
            </button>
          )}
          
          <button className="primary-save-btn" onClick={onSave} disabled={isLoading}>
            <Save size={18} />
            <span>{isLoading ? 'Saving...' : (selectedNote?.id && !selectedNote.shared ? 'Update' : 'Save')}</span>
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
      <RichTextEditor
        content={draft.content}
        onChange={(newContent) => setDraft({ ...draft, content: newContent })}
      />
    </section>
  );
}
