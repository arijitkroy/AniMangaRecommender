# AniMangaRecommender: Anime & Manga Recommendation System

This project is a complete anime and manga recommendation system with a Flask backend API and a Next.js frontend interface. It uses content-based filtering to provide personalized recommendations based on genres, themes, and demographics.

## Project Structure

```text
RecommendationSystem/
├── backend/                 # Flask API backend
│   ├── routes/              # Modularized Flask Blueprints (anime, manga, search, status)
│   ├── app.py               # Main API Application Entry
│   ├── data_loader.py       # Kagglehub dynamic dataset loading and preprocessing
│   ├── data_store.py        # Global application state dataset storage
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js frontend
│   ├── pages/               # Next.js page routes (index, _app, _document)
│   ├── components/          # Reusable modular React UI components
│   ├── hooks/               # Custom React hooks (useMediaSearch)
│   ├── services/            # API client service configs
│   └── package.json         # Node.js dependencies
├── start.sh                 # Linux/macOS Startup Script
└── start.bat                # Windows Startup Script
```

## Features

### Backend API (Flask - Modularized)
- RESTful API for anime/manga recommendations
- Modular `Blueprint` routing configuration
- **Dynamic Kagglehub** fetching to always load the latest datasets on startup
- Robust word-boundary and normalized string-matching fallback systems
- Content-based filtering using TF-IDF and cosine similarity
- Deep dataset inspection APIs (`/details/`)

### Frontend Interface (Next.js - Modularized)
- Modern, responsive React UI rebuilt from the ground up for readability
- Next.js Proxy rewrites hiding the Backend API port from public exposure
- Intelligent Modals allowing detailed inspection of specific media entries
- Built-in paginated view sorting
- Search by title for personalized recommendations
- Browse top-rated anime and manga
- Tabbed interface separating Title, Genre, and Top Media navigation

## Technologies Used

### Backend
- Flask & Flask-CORS (Python web and API framework)
- Pandas (Data processing)
- Kagglehub (Dynamic dataset synchronization)
- Scikit-learn (Machine learning algorithms)
- NumPy (Numerical computing)

### Frontend
- Next.js (React framework)
- Javascript (`.jsx` implementation)
- Custom Hooks (`useMediaSearch`)
- Tailwind CSS (Deep gradient styling & responsive grids)
- Axios (HTTP client via Next.js server proxy)

## Setup Instructions

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```bash
   python app.py
   ```

4. The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Start the backend Flask API first
2. Start the frontend Next.js application
3. Use the web interface to:
   - Search for recommendations by anime/manga title
   - Browse top-rated media
   - Search by genre combinations

## How It Works

The recommendation system uses content-based filtering:

1. **Data Processing**: Anime and manga data is dynamically fetched using `kagglehub` and preprocessed.
2. **Feature Engineering**: TF-IDF vectors are created from combined genre, theme, and demographic features
3. **Similarity Calculation**: Cosine similarity is used to find items with similar content profiles
4. **Recommendations**: Top similar items are returned as recommendations

## Data Sources

The system uses data from MyAnimeList, including:
- Titles and IDs
- Genres, themes, and demographics
- Scores and rating counts
- Types and other metadata

## Future Enhancements

- User authentication and personalized lists
- Collaborative filtering for improved recommendations
- Advanced search filters
- Mobile app version
- Recommendation explanations

## Quick Start

To quickly start the entire application, you can use one of the provided startup scripts from the repository root:

### Linux/macOS
```bash
chmod +x start.sh
./start.sh
```
- Validates that `python3` and `npm` are installed.
- Installs backend and frontend dependencies.
- Starts backend and frontend servers.
- Automatically stops the backend process when the script exits.

### Windows
```bat
start.bat
```
- Validates that `python` and `node` are installed.
- Installs backend and frontend dependencies.
- Starts backend in a separate terminal window and frontend in the current one.
- If the frontend stops, close the **Backend Server** window manually.

## Startup Script Notes

- Backend runs on `http://localhost:5000`.
- Frontend runs on `http://localhost:3000`.
- If you prefer manual startup, follow the backend/frontend setup sections above.