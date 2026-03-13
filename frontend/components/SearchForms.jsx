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
    <div className="card bg-white/5 border-white/10 p-4 sm:p-8 shadow-xl mb-8">
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
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Enter ${mediaType} title...`}
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
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
            Search by Genre / Theme / Demographic (comma separated)
          </label>
          <form onSubmit={handleGenreSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <input
              type="text"
              id="genre-search"
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              placeholder="e.g., Action, Adventure, Fantasy"
              className="input flex-1"
            />
            <button type="submit" className="btn btn-secondary whitespace-nowrap">
              Search
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
