import { Search } from 'lucide-react';

export default function UtilityRow({
  searchQuery,
  setSearchQuery,
  lookupId,
  setLookupId,
  onSearch,
  onOpenShared
}) {
  return (
    <section className="utility-row">
      <form className="search-form" onSubmit={onSearch}>
        <Search size={18} />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search notes"
        />
        <button type="submit">Search</button>
      </form>

      <form className="lookup-form" onSubmit={onOpenShared}>
        <input
          value={lookupId}
          onChange={(event) => setLookupId(event.target.value)}
          placeholder="Open shared note ID"
        />
        <button type="submit">Open</button>
      </form>
    </section>
  );
}
