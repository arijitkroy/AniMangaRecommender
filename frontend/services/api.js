// services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Get anime recommendations
  getAnimeRecommendations: async (title, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/anime/recommendations?title=${encodeURIComponent(title)}&top_n=${top_n}`
    );
    return response.data;
  },

  // Get manga recommendations
  getMangaRecommendations: async (title, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/manga/recommendations?title=${encodeURIComponent(title)}&top_n=${top_n}`
    );
    return response.data;
  },

  // Get top anime
  getTopAnime: async (top_n = 10, min_scored_by = 1000) => {
    const response = await axios.get(
      `${API_BASE}/anime/top?top_n=${top_n}&min_scored_by=${min_scored_by}`
    );
    return response.data;
  },

  // Get top manga
  getTopManga: async (top_n = 10, min_scored_by = 1000) => {
    const response = await axios.get(
      `${API_BASE}/manga/top?top_n=${top_n}&min_scored_by=${min_scored_by}`
    );
    return response.data;
  },

  // Search by genre
  searchByGenre: async (genres, media_type, top_n = 10) => {
    const response = await axios.get(
      `${API_BASE}/search/genre?genres=${encodeURIComponent(genres)}&media_type=${media_type}&top_n=${top_n}`
    );
    return response.data;
  }
};
