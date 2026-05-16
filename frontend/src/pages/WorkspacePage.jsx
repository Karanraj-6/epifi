import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import Editor from '../components/Editor.jsx';
import NoteList from '../components/NoteList.jsx';
import SharePanel from '../components/SharePanel.jsx';
import UtilityRow from '../components/UtilityRow.jsx';

const emptyDraft = { title: '', content: '', is_favorite: false };

export default function WorkspacePage({ api, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [sharedNotesList, setSharedNotesList] = useState([]);
  const [showSharedModal, setShowSharedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preAiContent, setPreAiContent] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await api.listNotes();
      setNotes(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function startNew() {
    setSelectedNote(null);
    setDraft(emptyDraft);
  }

  function selectNote(note) {
    setSelectedNote(note);
    setDraft({
      title: note.title,
      content: note.content,
      is_favorite: note.is_favorite
    });
  }

  async function saveNote() {
    if (!draft.title.trim() || !draft.content.trim()) {
      showToast('Title and content are required.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      const payload = { title: draft.title, content: draft.content };
      const saved = selectedNote?.id && !selectedNote.shared
        ? await api.updateNote(selectedNote.id, payload)
        : await api.createNote(payload);

      if (!saved) {
        showToast('Failed to save note.', 'error');
        return;
      }

      setSelectedNote(saved);
      setDraft({ title: saved.title, content: saved.content, is_favorite: saved.is_favorite });
      await loadNotes();
      showToast('Saved successfully.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteNote(note) {
    try {
      await api.deleteNote(note.id);
      if (selectedNote?.id === note.id) startNew();
      await loadNotes();
      showToast('Note deleted.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function toggleFavorite(note) {
    try {
      const updated = await api.setFavorite(note.id, !note.is_favorite);
      setNotes((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedNote?.id === updated.id) {
        setSelectedNote(updated);
        setDraft({ title: updated.title, content: updated.content, is_favorite: updated.is_favorite });
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function shareNote(event) {
    event.preventDefault();
    if (!selectedNote?.id || !shareEmail) return;

    try {
      const result = await api.shareNote(selectedNote.id, { share_with_email: shareEmail });
      setShareEmail('');
      showToast(result.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function runSearch(event) {
    event.preventDefault();
    if (!searchQuery.trim()) {
      await loadNotes();
      return;
    }

    try {
      const data = await api.search(searchQuery);
      setNotes(data);
      showToast(`Found ${data.length} note${data.length === 1 ? '' : 's'}.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function openSharedNote(event) {
    if (event) event.preventDefault();
    if (!lookupId.trim()) return;

    try {
      const note = await api.getNote(lookupId.trim());
      setSelectedNote({ ...note, shared: true });
      setDraft({ title: note.title, content: note.content, is_favorite: note.is_favorite });
      showToast('Shared note opened.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function improveNote() {
    if (!draft.content.trim()) {
      showToast('Write some content first to improve it.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      showToast('AI is thinking...', 'info');
      setPreAiContent(draft.content);
      const result = await api.improveNote({ content: draft.content });
      setDraft({ ...draft, content: result.improved_content });
      showToast('Note improved with AI!', 'success');
    } catch (err) {
      showToast(`AI Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  function undoImproveNote() {
    if (preAiContent !== null) {
      setDraft({ ...draft, content: preAiContent });
      setPreAiContent(null);
      showToast('Reverted to your original content.', 'info');
    }
  }

  async function loadSharedNotesList() {
    try {
      const data = await api.listSharedNotes();
      setSharedNotesList(data);
      setShowSharedModal(true);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleSharedNoteClick(item) {
    setLookupId(item.id);
    setShowSharedModal(false);
    // Use a timeout to ensure state updates before opening
    setTimeout(() => {
      // Create a fake event object or modify openSharedNote to not require event
      // We already modified it above to check if event exists
      openSharedNote();
    }, 0);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Notes</p>
          <h1>Workspace</h1>
        </div>
        <button className="icon-button" onClick={onLogout} title="Sign out">
          <LogOut size={19} />
        </button>
      </header>

      <UtilityRow
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lookupId={lookupId}
        setLookupId={setLookupId}
        onSearch={runSearch}
        onOpenShared={openSharedNote}
        onLoadSharedNotes={loadSharedNotesList}
      />

      {showSharedModal && (
        <div className="shared-notes-modal">
          <div className="modal-header">
            <h3>Shared with me</h3>
            <button onClick={() => setShowSharedModal(false)}>Close</button>
          </div>
          {sharedNotesList.length === 0 ? (
            <p>No notes have been shared with you.</p>
          ) : (
            <ul>
              {sharedNotesList.map(item => (
                <li key={item.id} onClick={() => handleSharedNoteClick(item)}>
                  <strong>{item.title}</strong>
                  <br />
                  <small>From: {item.sender_email}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Toast container is now global in App.jsx */}

      <div className="workspace">
        <NoteList
          notes={notes}
          selectedId={selectedNote?.id}
          onSelect={selectNote}
          onNew={startNew}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteNote}
        />

        <Editor
          draft={draft}
          setDraft={setDraft}
          selectedNote={selectedNote}
          onSave={saveNote}
          onShare={() => showToast('Enter an email below to share this note.', 'info')}
          onImprove={improveNote}
          onUndoImprove={undoImproveNote}
          canUndo={preAiContent !== null}
          onCloseShared={startNew}
          isLoading={isLoading}
        />

        <SharePanel
          selectedNote={selectedNote}
          shareEmail={shareEmail}
          setShareEmail={setShareEmail}
          onShare={shareNote}
        />
      </div>
    </main>
  );
}
