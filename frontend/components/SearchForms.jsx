export default function SearchForms({
  activeTab,
  mediaType,
  setMediaType,
  searchTerm,
  setSearchTerm,
  handleSearch,
  genreSearch,
  setGenreSearch,
  handleGenreSearch,
}) {
  return (
    <div className="bg-background-card rounded-xl p-6">
      <div className="mb-4">
        <label htmlFor="media-type" className="block text-sm font-medium mb-2">
          Select Media Type
        </label>
        <select
          id="media-type"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="input max-w-xs"
        >
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
        </select>
      </div>
      {activeTab === "recommendations" && (
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Find Recommendations by Title
          </label>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Enter ${mediaType} title...`}
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      )}
      {activeTab === "genres" && (
        <div>
          <label
            htmlFor="genre-search"
            className="block text-sm font-medium mb-2"
          >
            Search by Genre (comma separated)
          </label>
          <form onSubmit={handleGenreSearch} className="flex gap-2 max-w-2xl">
            <input
              type="text"
              id="genre-search"
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="e.g., Action, Adventure, Fantasy"
              className="input flex-1"
            />
            <button type="submit" className="btn btn-secondary">
              Find by Genre
            </button>
          </form>
        </div>
      )}
      {activeTab === "top" && (
        <div>
          <p className="text-gray-400 text-sm mt-2">
            Showing the highest rated {mediaType} on MyAnimeList.
          </p>
        </div>
      )}
    </div>
  );
}
