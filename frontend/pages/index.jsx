import { useState, useEffect } from "react";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { api } from "../services/api";

export default function Home() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("anime");
  const [recommendations, setRecommendations] = useState([]);
  const [topMedia, setTopMedia] = useState([]);
  const [genreSearch, setGenreSearch] = useState("");
  const [genreResults, setGenreResults] = useState([]);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // API base URL
  const API_BASE = "http://localhost:5000/api";

  // Fetch top media on component mount
  useEffect(() => {
    fetchTopMedia();
  }, []);

  // Refetch top media if mediaType changes while on the "top" tab
  useEffect(() => {
    if (activeTab === "top") {
      setCurrentPage(1);
      fetchTopMedia();
    }
  }, [mediaType]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const fetchTopMedia = async () => {
    try {
      setLoading(true);
      if (mediaType === "anime") {
        const data = await api.getTopAnime(120, 1000);
        setTopMedia(data);
      } else {
        const data = await api.getTopManga(120, 1000);
        setTopMedia(data);
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch top media");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      if (mediaType === "anime") {
        const data = await api.getAnimeRecommendations(searchTerm, 120);
        setRecommendations(data.recommendations);
      } else {
        const data = await api.getMangaRecommendations(searchTerm, 120);
        setRecommendations(data.recommendations);
      }
      setActiveTab("recommendations");
      setCurrentPage(1);
      setError("");
    } catch (err) {
      setError("No recommendations found for this title");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSearch = async (e) => {
    e.preventDefault();
    if (!genreSearch.trim()) return;

    try {
      setLoading(true);
      const data = await api.searchByGenre(genreSearch, mediaType, 120);
      setGenreResults(data);
      setActiveTab("genres");
      setCurrentPage(1);
      setError("");
    } catch (err) {
      setError("Failed to search by genre");
      setGenreResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedData = (items) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalItems === 0) return null;

    return (
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-700 gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="items-per-page" className="text-sm text-gray-400">
            Show:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="input text-sm py-1 px-2 h-auto w-[60px]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span className="text-sm text-gray-400">per page</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400 mx-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="btn btn-secondary py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const MediaCard = ({ item }) => (
    <div className="card mb-4">
      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge badge-genre">{item.type}</span>
        <span className="badge" style={{ backgroundColor: "#f59e0b" }}>
          Score:{" "}
          {typeof item.score === "number" ? item.score.toFixed(2) : "N/A"}
        </span>
        {"similarity_score" in item && item.similarity_score && (
          <span className="badge" style={{ backgroundColor: "#8b5cf6" }}>
            Similarity: {(item.similarity_score * 100).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {(item.genres || []).slice(0, 3).map((genre, index) => (
          <span key={index} className="badge badge-genre">
            {genre}
          </span>
        ))}
        {(item.themes || []).slice(0, 3).map((theme, index) => (
          <span key={index} className="badge badge-theme">
            {theme}
          </span>
        ))}
      </div>

      {"scored_by" in item && item.scored_by && (
        <p className="text-sm text-gray-400">
          Rated by {item.scored_by?.toLocaleString()} users
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            Anime & Manga Recommender
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover your next favorite anime or manga with our AI-powered
            recommendation system
          </p>
        </header>

        {/* Main Content */}
        <main>
          {/* Main Navigation Tabs */}
          <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
            <button
              className={`pb-3 px-6 font-medium whitespace-nowrap ${
                activeTab === "recommendations"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("recommendations")}
            >
              Title Search
            </button>
            <button
              className={`pb-3 px-6 font-medium whitespace-nowrap ${
                activeTab === "genres"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => handleTabChange("genres")}
            >
              Genre Search
            </button>
            <button
              className={`pb-3 px-6 font-medium whitespace-nowrap ${
                activeTab === "top"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => {
                handleTabChange("top");
                fetchTopMedia();
              }}
            >
              Top Media
            </button>
          </div>

          {/* Search Forms and Filters */}
          <section className="mb-8">
            <div className="bg-background-card rounded-xl p-6">
              <div className="mb-4">
                <label
                  htmlFor="media-type"
                  className="block text-sm font-medium mb-2"
                >
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
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium mb-2"
                  >
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

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-6 text-center">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex justify-center my-8">
                <div className="loading-spinner"></div>
              </div>
            )}
          </section>

          {/* Results Section */}
          <section>

            {/* Recommendations Tab */}
            {activeTab === "recommendations" && (
              <div>
                {(recommendations || []).length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">
                      Recommendations for "
                      {recommendations[0]?.title || searchTerm}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getPaginatedData(recommendations).map((rec, index) => (
                        <MediaCard key={index} item={rec} />
                      ))}
                    </div>
                    {renderPagination(recommendations.length)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">
                      Find Your Next Favorite
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                      Enter an anime or manga title above to get personalized
                      recommendations based on genres, themes, and demographics.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Top Media Tab */}
            {activeTab === "top" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Top {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                </h2>
                {(topMedia || []).length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getPaginatedData(topMedia).map((item, index) => (
                        <MediaCard key={index} item={item} />
                      ))}
                    </div>
                    {renderPagination(topMedia.length)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Loading top {mediaType}...</p>
                  </div>
                )}
              </div>
            )}

            {/* Genre Search Results Tab */}
            {activeTab === "genres" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {genreSearch ? `"${genreSearch}"` : "Genre"} Search Results
                  {!genreSearch && (
                    <span className="text-gray-400 text-lg font-normal ml-2">
                       - type a genre to search
                    </span>
                  )}
                </h2>
                {(genreResults || []).length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getPaginatedData(genreResults).map((item, index) => (
                        <MediaCard key={index} item={item} />
                      ))}
                    </div>
                    {renderPagination(genreResults.length)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">
                      Explore by Genres
                    </h2>
                    <p className="text-gray-400">
                      Enter genres like Action, Fantasy, Sci-Fi above.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Powered by MyAnimeList data and machine learning algorithms</p>
          <p className="mt-2">
            Anime & Manga Recommendation System © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
