import Head from "next/head";
import MediaModal from "../components/MediaModal";
import RecommendationsTab from "../components/RecommendationsTab";
import TopMediaTab from "../components/TopMediaTab";
import GenreTab from "../components/GenreTab";
import NavigationTabs from "../components/NavigationTabs";
import SearchForms from "../components/SearchForms";
import useMediaSearch from "../hooks/useMediaSearch";

export default function Home() {
  const {
    searchTerm,
    setSearchTerm,
    mediaType,
    setMediaType,
    recommendations,
    topMedia,
    genreSearch,
    setGenreSearch,
    genreResults,
    activeTab,
    loading,
    error,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    matchedTitle,
    selectedMedia,
    isModalOpen,
    modalLoading,
    modalError,
    fetchTopMedia,
    handleTabChange,
    openModal,
    closeModal,
    handleSearch,
    handleGenreSearch,
    getPaginatedData,
  } = useMediaSearch();
  return (
    <div className="min-h-screen py-8 px-4">
      <Head>
        <title>AniMangaRecommender</title>
        <meta name="description" content="Discover your next favorite anime or manga!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text leading-tight">
            AniMangaRecommender
          </h1>
          <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Discover your next favorite anime or manga with our AI-powered
            recommendation system
          </p>
        </header>
        <main>
          <NavigationTabs 
            activeTab={activeTab} 
            handleTabChange={handleTabChange} 
            fetchTopMedia={fetchTopMedia} 
          />
          <section className="mb-8">
            <SearchForms 
              activeTab={activeTab}
              mediaType={mediaType}
              setMediaType={setMediaType}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              genreSearch={genreSearch}
              setGenreSearch={setGenreSearch}
              handleGenreSearch={handleGenreSearch}
            />
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
          <section>
            {activeTab === "recommendations" && (
              <RecommendationsTab 
                recommendations={recommendations}
                matchedTitle={matchedTitle}
                searchTerm={searchTerm}
                getPaginatedData={getPaginatedData}
                openModal={openModal}
                totalItems={(recommendations || []).length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
            {activeTab === "top" && (
              <TopMediaTab 
                topMedia={topMedia}
                mediaType={mediaType}
                getPaginatedData={getPaginatedData}
                openModal={openModal}
                totalItems={(topMedia || []).length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
            {activeTab === "genres" && (
              <GenreTab 
                genreResults={genreResults}
                genreSearch={genreSearch}
                getPaginatedData={getPaginatedData}
                openModal={openModal}
                totalItems={(genreResults || []).length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
          </section>
        </main>
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col items-center justify-center gap-2 pb-8">
          <p>Powered by MyAnimeList data and machine learning algorithms</p>
          <p>
            AniMangaRecommender © {new Date().getFullYear()}
          </p>
          <a
            href="https://github.com/arijitkroy/AniMangaRecommender"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Support this project on GitHub
          </a>
        </footer>
      </div>
      <MediaModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        loading={modalLoading} 
        error={modalError} 
        media={selectedMedia} 
      />
    </div>
  );
}
