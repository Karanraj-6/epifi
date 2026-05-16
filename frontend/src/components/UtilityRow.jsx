import { Search, Share, Inbox } from 'lucide-react';

export default function UtilityRow({
  searchQuery,
  setSearchQuery,
  lookupId,
  setLookupId,
  onSearch,
  onOpenShared,
  onLoadSharedNotes
}) {
  return (
    <section className="utility-row-container">
      <div className="utility-row">
        <form className="search-form-premium" onSubmit={onSearch}>
          <Search size={20} className="search-icon" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search your ideas..."
          />
          <button type="submit" className="search-submit">Search</button>
        </form>

        <div className="utility-divider"></div>

        <div className="lookup-actions">
          <form className="lookup-form-premium" onSubmit={onOpenShared}>
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="Paste note ID to open..."
            />
            <button type="submit" className="icon-action-button" title="Open by ID">
              <Inbox size={18} />
            </button>
          </form>
          
          <button type="button" onClick={onLoadSharedNotes} className="shared-with-me-button">
            <Share size={18} />
            <span>Shared with me</span>
          </button>
        </div>
      </div>
    </section>
  );
}
