```
# Anime & Manga Recommendation System - Backend

This is the Flask API backend for the Anime & Manga Recommendation System. It provides RESTful endpoints for accessing anime and manga recommendations based on content-based filtering.

## Features

- Get anime/manga recommendations based on title or ID
- Retrieve top-rated anime and manga
- Search by genre combinations
- Content-based filtering using TF-IDF and cosine similarity

## Technologies Used

- Flask
- Pandas
- NumPy
- Scikit-learn
- Flask-CORS

## API Endpoints

### Health Check
- `GET /api/status` - Check if the API is running

### Anime Recommendations
- `GET /api/anime/recommendations` - Get anime recommendations
  - Query params: `title`, `anime_id`, `top_n` (default: 10)

### Manga Recommendations
- `GET /api/manga/recommendations` - Get manga recommendations
  - Query params: `title`, `manga_id`, `top_n` (default: 10)

### Top Rated Media
- `GET /api/anime/top` - Get top-rated anime
  - Query params: `top_n` (default: 10), `min_scored_by` (default: 1000)
- `GET /api/manga/top` - Get top-rated manga
  - Query params: `top_n` (default: 10), `min_scored_by` (default: 1000)

### Genre Search
- `GET /api/search/genre` - Search anime/manga by genre
  - Query params: `genres` (comma-separated), `media_type` (anime|manga), `top_n` (default: 10)

## Setup Instructions

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. The API will be available at `http://localhost:5000`

## How It Works

The backend loads the anime and manga datasets from CSV files and preprocesses them. It then creates TF-IDF vectors based on combined genre, theme, and demographic features. When a recommendation request is made, it calculates cosine similarity between the input item and all other items to find the most similar ones.

## Data Sources

The system uses data from MyAnimeList, including:
- Titles and IDs
- Genres, themes, and demographics
- Scores and rating counts
- Types and other metadata
