# AniMangaRecommender - Frontend App

This is the Next.js frontend interface for the AniMangaRecommender application, featuring a deeply responsive design, modularized architecture, and an integrated backend proxy.

## Features

- **Premium Glassmorphism UI**: Modern aesthetic featuring backdrop-blur, subtle borders, and background glow effects.
- **Mobile Responsiveness**: Optimized layouts for all screen sizes, including stacked forms and touch-friendly controls.
- **Tactile Feedback**: Smooth micro-animations and active states for a premium interactive feel.
- **Next.js Proxy Routing**: Securely forwards all `/api/*` fetch requests, hiding the Flask endpoint.
- **Deeply Modular Components**: Separated architecture for Modals, Nav Tabs, and Cards.
- **Search capabilities**: Lookup anime/manga by title (bilingual) or match by genre matrices.
- **Top Media Exploration**: Browse top-rated datasets directly.

## Technologies Used

- **Framework**: Next.js 13
- **Library**: React 18
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (interacting with Next.js Rewrite Proxies)

## Configuration

To establish communication with the backend Flask API, the Next.js app utilizes an environment variable that dictates its proxy target. This defaults to `127.0.0.1:5000`.

To override this, create a `.env.local` file in the `frontend/` root:
```env
API_BASE=http://your-remote-api-url:5000/api
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) inside your web browser.

## Project Structure

```text
frontend/
├── components/      # Separated modular React UI components
├── hooks/           # Custom React hooks (useMediaSearch)
├── pages/           # Next.js pages/routing (index, _app)
├── public/          # Static assets (favicon.png)
├── services/        # API client bindings
├── styles/          # Tailwind definitions (globals.css)
├── .env.local       # Local backend URL config
└── next.config.js   # API rewrite proxy routing & Image domains
```

## Deployment

To compile the application bundle for production environments:
```bash
npm run build
```

To start the hosted compiled server:
```bash
npm start
```

