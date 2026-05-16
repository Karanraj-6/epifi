import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Editor from '../components/Editor.jsx';
import NoteList from '../components/NoteList.jsx';
import SharePanel from '../components/SharePanel.jsx';
import UtilityRow from '../components/UtilityRow.jsx';

const emptyDraft = { title: '', content: '', is_favorite: false };

export default function WorkspacePage({ api, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [lookupId, setLookupId] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await api.listNotes();
      setNotes(data);
      setStatus('');
    } catch (err) {
      setStatus(err.message);
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
      setStatus('Title and content are required.');
      return;
    }

    try {
      const payload = { title: draft.title, content: draft.content };
      const saved = selectedNote?.id && !selectedNote.shared
        ? await api.updateNote(selectedNote.id, payload)
        : await api.createNote(payload);

      setSelectedNote(saved);
      setDraft({ title: saved.title, content: saved.content, is_favorite: saved.is_favorite });
      await loadNotes();
      setStatus('Saved.');
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function deleteNote(note) {
    try {
      await api.deleteNote(note.id);
      if (selectedNote?.id === note.id) startNew();
      await loadNotes();
      setStatus('Deleted.');
    } catch (err) {
      setStatus(err.message);
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
      setStatus(err.message);
    }
  }

  async function shareNote(event) {
    event.preventDefault();
    if (!selectedNote?.id || !shareEmail) return;

    try {
      const result = await api.shareNote(selectedNote.id, { share_with_email: shareEmail });
      setShareEmail('');
      setStatus(result.message);
    } catch (err) {
      setStatus(err.message);
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
      setStatus(`Found ${data.length} note${data.length === 1 ? '' : 's'}.`);
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function openSharedNote(event) {
    event.preventDefault();
    if (!lookupId.trim()) return;

    try {
      const note = await api.getNote(lookupId.trim());
      setSelectedNote({ ...note, shared: true });
      setDraft({ title: note.title, content: note.content, is_favorite: note.is_favorite });
      setStatus('Shared note opened.');
    } catch (err) {
      setStatus(err.message);
    }
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
      />

      {status && <p className="status-line">{status}</p>}

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
          onShare={() => setStatus('Enter an email below to share this note.')}
          onCloseShared={startNew}
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
