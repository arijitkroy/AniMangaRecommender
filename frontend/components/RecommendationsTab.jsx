import MediaCard from "./MediaCard";
import Pagination from "./Pagination";

export default function RecommendationsTab({
  recommendations,
  matchedTitle,
  searchTerm,
  getPaginatedData,
  openModal,
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setItemsPerPage
}) {
  return (
    <div>
      {(recommendations || []).length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Recommendations for "{matchedTitle || searchTerm}"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedData(recommendations).map((rec, index) => (
              <MediaCard key={index} item={rec} onClick={openModal} />
            ))}
          </div>
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Find Your Next Favorite</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enter an anime or manga title above to get personalized recommendations
            based on genres, themes, and demographics.
          </p>
        </div>
      )}
    </div>
  );
}
