import axios from 'axios';

const API_BASE = '/api';

export const api = {
  getAnimeRecommendations: async (title, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/anime/recommendations?title=${encodeURIComponent(title)}&top_n=${top_n}`
    );
    return response.data;
  },
  getMangaRecommendations: async (title, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/manga/recommendations?title=${encodeURIComponent(title)}&top_n=${top_n}`
    );
    return response.data;
  },
  getTopAnime: async (top_n = 10, min_scored_by = 1000) => {
    const response = await axios.get(
      `${API_BASE}/anime/top?top_n=${top_n}&min_scored_by=${min_scored_by}`
    );
    return response.data;
  },
  getTopManga: async (top_n = 10, min_scored_by = 1000) => {
    const response = await axios.get(
      `${API_BASE}/manga/top?top_n=${top_n}&min_scored_by=${min_scored_by}`
    );
    return response.data;
  },
  searchByGenre: async (genres, media_type, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/search/genre?genres=${encodeURIComponent(genres)}&media_type=${media_type}&top_n=${top_n}`
    );
    return response.data;
  },
  getAnimeDetails: async (anime_id) => {
    const response = await axios.get(`${API_BASE}/anime/details/${anime_id}`);
    return response.data;
  },
  getMangaDetails: async (manga_id) => {
    const response = await axios.get(`${API_BASE}/manga/details/${manga_id}`);
    return response.data;
  }
};
