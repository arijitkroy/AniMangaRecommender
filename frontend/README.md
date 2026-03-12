# AniMangaRecommender - Frontend App

This is the Next.js frontend interface for the AniMangaRecommender application, featuring a deeply responsive design, modularized architecture, and an integrated backend proxy.

## Features

- **Next.js Proxy Routing**: Securely forwards all `/api/*` fetch requests directly through the Next server (`next.config.js`), completely hiding the local `localhost:5000` Flask endpoint from the client browser.
- **Deeply Modular Components**: Clean, separated architecture leveraging independent UI constructs (Modals, Nav Tabs, Cards).
- **Custom React Hooks**: Centralized data management and API fetch flows through a dedicated `useMediaSearch`.
- **Search capabilities**: Lookup anime/manga by title natively or match by genre matrices.
- **Top Media Exploration**: Check out the top-rated datasets directly.
- **Custom Favicon**: Embedded a globally styled cyber-neon "AM" favicon.

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

