export default function MediaModal({ isOpen, onClose, loading, error, media }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700 shadow-2xl custom-scrollbar animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
          aria-label="Close Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loading-spinner mb-4"></div>
              <p className="text-gray-400">
                Loading comprehensive dataset details...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">
              <p>{error}</p>
            </div>
          ) : media ? (
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold mb-1 text-purple-400 pr-8">
                {media.title}
              </h2>
              {media.title_english && media.title_english !== media.title && (
                <p className="text-gray-400 mb-6 italic">
                  {media.title_english}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-6">
                <div className="col-span-1 border-r border-gray-800 pr-6">
                  <div className="space-y-4">
                    {media.main_picture && (
                      <div className="mb-6 rounded-lg overflow-hidden border border-gray-700 shadow-lg relative">
                        <img
                          src={media.main_picture}
                          alt={`Cover for ${media.title}`}
                          className="w-full h-auto object-cover max-h-[400px]"
                        />
                      </div>
                    )}
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                        Score
                      </div>
                      <div className="font-bold text-2xl text-yellow-500">
                        {media.score || "N/A"}
                      </div>
                      {media.scored_by && (
                        <div className="text-xs text-gray-500 capitalize">
                          {media.scored_by.toLocaleString()} users
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Type:</span>{" "}
                      <span className="font-medium float-right text-gray-300">
                        {media.type || "Unknown"}
                      </span>
                    </div>
                    {media.episodes !== undefined && (
                      <div>
                        <span className="text-gray-500 text-sm">Episodes:</span>{" "}
                        <span className="font-medium float-right text-gray-300">
                          {media.episodes}
                        </span>
                      </div>
                    )}
                    {media.chapters !== undefined && (
                      <div>
                        <span className="text-gray-500 text-sm">Chapters:</span>{" "}
                        <span className="font-medium float-right text-gray-300">
                          {media.chapters}
                        </span>
                      </div>
                    )}
                    {media.volumes !== undefined && (
                      <div>
                        <span className="text-gray-500 text-sm">Volumes:</span>{" "}
                        <span className="font-medium float-right text-gray-300">
                          {media.volumes}
                        </span>
                      </div>
                    )}
                    {media.status && (
                      <div>
                        <span className="text-gray-500 text-sm">Status:</span>{" "}
                        <span className="font-medium float-right text-gray-300 text-right max-w-[120px]">
                          {media.status}
                        </span>
                      </div>
                    )}
                    {media.aired && (
                      <div>
                        <span className="text-gray-500 text-sm">Aired:</span>{" "}
                        <span className="font-medium float-right text-gray-300 text-right max-w-[120px]">
                          {media.aired}
                        </span>
                      </div>
                    )}
                    {media.published && (
                      <div>
                        <span className="text-gray-500 text-sm">
                          Published:
                        </span>{" "}
                        <span className="font-medium float-right text-gray-300 text-right max-w-[120px]">
                          {media.published}
                        </span>
                      </div>
                    )}
                    {media.source && (
                      <div>
                        <span className="text-gray-500 text-sm">Source:</span>{" "}
                        <span className="font-medium float-right text-gray-300">
                          {media.source}
                        </span>
                      </div>
                    )}
                    {media.studios && media.studios.length > 0 && (
                      <div className="pt-2 border-t border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">
                          Studios:
                        </div>
                        <div className="text-gray-300 text-sm font-medium">
                          {media.studios.join(", ")}
                        </div>
                      </div>
                    )}
                    {media.authors && media.authors.length > 0 && (
                      <div className="pt-2 border-t border-gray-800">
                        <div className="text-gray-500 text-sm mb-1">
                          Authors:
                        </div>
                        <div className="text-gray-300 text-sm font-medium">
                          {media.authors.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-6">
                  {media.synopsis && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-gray-200 border-b border-gray-800 pb-2">
                        Synopsis
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {media.synopsis
                          .replace("[Written by MAL Rewrite]", "")
                          .trim()}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-200 border-b border-gray-800 pb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(media.genres || []).map((g, i) => (
                        <span
                          key={`g-${i}`}
                          className="badge badge-genre text-xs"
                        >
                          {g}
                        </span>
                      ))}
                      {(media.themes || []).map((t, i) => (
                        <span
                          key={`t-${i}`}
                          className="badge badge-theme text-xs"
                        >
                          {t}
                        </span>
                      ))}
                      {(media.demographics || []).map((d, i) => (
                        <span
                          key={`d-${i}`}
                          className="badge text-xs"
                          style={{ backgroundColor: "#3b82f6" }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {media.background && (
                <div className="mt-6 p-5 bg-gray-800/40 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-bold mb-3 text-gray-400 justify-start items-center flex gap-2 uppercase tracking-wider">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Background Context
                  </h3>
                  <p className="text-sm text-gray-300 italic leading-relaxed">
                    {media.background}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
