import React from "react";
import MediaCard from "./MediaCard";
import Pagination from "./Pagination";

export default function GenreTab({
  genreResults,
  genreSearch,
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
          <h2 className="text-2xl font-bold mb-4">Explore by Genres</h2>
          <p className="text-gray-400">
            Enter genres like Action, Fantasy, Sci-Fi above.
          </p>
        </div>
      )}
    </div>
  );
}
