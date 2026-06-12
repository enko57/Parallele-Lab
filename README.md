# MediaTracker (Parallele-Lab)

## About The Project

MediaTracker is a comprehensive, personal library management system. It allows users to centralize and track their entire entertainment consumption across multiple mediums in a single dashboard. Inspired by platforms like MyAnimeList or Letterboxd, this application enables users to log what they are currently reading, playing, or watching, rate completed media, and maintain a backlog of planned content. 

The application is built on a scalable, microservice-based architecture designed for modern web deployment. It uses a clean, dark-mode focused React frontend to deliver a smooth user experience.

## External APIs Used

To ensure data accuracy and relieve the user from manual data entry, MediaTracker integrates with several public APIs to fetch real-time metadata (such as cover posters, total episodes, runtimes, and page counts) when adding new entries to the library:

- **TMDB (The Movie Database) API**: Used to query movies and television series. It provides official posters and calculates the runtime or total episodes.
- **Jikan API (MyAnimeList)**: An unofficial open-source API for MyAnimeList, used to fetch anime metadata and total episode counts without requiring authentication keys.
- **RAWG Video Games Database API**: Used to search for video games and retrieve official game covers.
- **OpenLibrary API**: A free, open-source catalog used to fetch book covers and determine median page counts.

## Project Architecture

This project is orchestrated by Docker Compose to ensure isolation and scalability.

### Core Components
- **Frontend**: A React application built with Vite and vanilla CSS. 
- **API Gateway**: Nginx-based reverse proxy that routes traffic from the frontend to the appropriate backend services.
- **Auth Service**: Node.js backend dedicated to user authentication and session management.
- **Media Service**: Node.js backend responsible for handling the CRUD operations of the user's media collection.
- **Database**: PostgreSQL database for persistent data storage.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend development)

### Running the Application

1. Start the microservices and the database via Docker:
   ```bash
   docker-compose up -d
   ```

2. Configure environment variables for the frontend:
   Navigate to the `frontend` directory, copy the `.env.template` to `.env`, and provide your API keys.
   ```env
   VITE_TMDB_API_KEY=your_tmdb_token
   VITE_RAWG_API_KEY=your_rawg_key
   ```

3. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be accessible at `http://localhost:5173`.
