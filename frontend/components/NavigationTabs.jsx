export default function NavigationTabs({ activeTab, handleTabChange, fetchTopMedia }) {
  return (
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
  );
}
