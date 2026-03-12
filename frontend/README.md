```
# Anime & Manga Recommendation System - Frontend

This is the frontend interface for the Anime & Manga Recommendation System, built with Next.js, React, and Tailwind CSS.

## Features

- Search for anime/manga recommendations by title
- Browse top-rated anime and manga
- Search by genre combinations
- Responsive design for all device sizes
- Modern UI with dark theme

## Technologies Used

- Next.js 13
- React 18
- JavaScript (JSX)
- Tailwind CSS
- Axios for API requests

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── pages/           # Next.js pages
├── styles/          # Global styles and Tailwind config
├── public/          # Static assets
├── components/      # React components (to be created)
└── ...
```

## API Integration

The frontend connects to the Flask backend API running on `http://localhost:5000`. Make sure the backend is running before starting the frontend.

## Deployment

To build for production:
```bash
npm run build
```

To start production server:
```bash
npm start
```
