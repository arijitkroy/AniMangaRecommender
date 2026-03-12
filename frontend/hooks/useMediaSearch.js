import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function useMediaSearch() {
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
  const [matchedTitle, setMatchedTitle] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
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
  useEffect(() => {
    fetchTopMedia();
  }, []);
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
  const openModal = async (item) => {
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError("");
    setSelectedMedia(null);
    try {
      const id = item.anime_id || item.manga_id || item.id;
      if (
        mediaType === "anime" ||
        item.type?.toLowerCase() === "anime" ||
        item.type?.toLowerCase() === "tv" ||
        item.type?.toLowerCase() === "movie"
      ) {
        const details = await api.getAnimeDetails(id);
        setSelectedMedia(details);
      } else {
        const details = await api.getMangaDetails(id);
        setSelectedMedia(details);
      }
    } catch (err) {
      setModalError("Failed to fetch detailed information.");
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMedia(null);
    }, 200);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      setLoading(true);
      if (mediaType === "anime") {
        const data = await api.getAnimeRecommendations(searchTerm, 120);
        setRecommendations(data.recommendations);
        setMatchedTitle(data.input_anime?.title || searchTerm);
      } else {
        const data = await api.getMangaRecommendations(searchTerm, 120);
        setRecommendations(data.recommendations);
        setMatchedTitle(data.input_manga?.title || searchTerm);
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
  return {
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
  };
}
