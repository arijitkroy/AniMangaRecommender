export default function MediaCard({ item, onClick }) {
  return (
    <div
      className="card mb-4 cursor-pointer hover:bg-gray-800 transition-colors border border-transparent hover:border-purple-500 shadow-md hover:shadow-purple-900/40"
      onClick={() => onClick(item)}
    >
      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge badge-genre">{item.type}</span>
        <span className="badge" style={{ backgroundColor: "#f59e0b" }}>
          Score: {typeof item.score === "number" ? item.score.toFixed(2) : "N/A"}
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
}
