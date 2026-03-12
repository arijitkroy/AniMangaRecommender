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
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
            AniMangaRecommender
          </h1>
          <p className="text-l text-gray-300 max-w-2xl mx-auto">
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
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Powered by MyAnimeList data and machine learning algorithms</p>
          <p className="mt-2">
            AniMangaRecommender Â© {new Date().getFullYear()}
          </p>
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
