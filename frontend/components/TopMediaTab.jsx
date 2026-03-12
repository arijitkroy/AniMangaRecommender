import MediaCard from "./MediaCard";
import Pagination from "./Pagination";

export default function TopMediaTab({
  topMedia,
  mediaType,
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
      <h2 className="text-2xl font-bold mb-6">
        Top {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
      </h2>
      {(topMedia || []).length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedData(topMedia).map((item, index) => (
              <MediaCard key={index} item={item} onClick={openModal} />
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
          <p className="text-gray-400">Loading top {mediaType}...</p>
        </div>
      )}
    </div>
  );
}
