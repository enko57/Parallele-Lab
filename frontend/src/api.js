const API_BASE_URL = 'http://localhost:80/api/media';

export const fetchTrackerData = async () => {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Backend not reachable:", e);
    return [];
  }
};

export const addMedia = async (entry) => {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return await res.json();
};

export const updateMedia = async (id, updates) => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
};

export const deleteMedia = async (id) => {
  await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });
};

// External API Search Integration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export const searchExternalAPI = async (query, type) => {
  try {
    // 1. Movies & Series (TMDB API)
    if (type === 'Movie' || type === 'Series') {
      const searchType = type === 'Movie' ? 'movie' : 'tv';
      const options = TMDB_API_KEY ? {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`
        }
      } : {};
      
      const res = await fetch(`https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(query)}&language=de-DE`, options);
      const data = await res.json();
      
      if (data.results) {
        const topResults = data.results.slice(0, 5);
        
        // Fetch detailed data for runtime/episodes
        const detailedResults = await Promise.all(topResults.map(async (item) => {
          let maxProgress = '?';
          try {
            if (TMDB_API_KEY) {
              const detailRes = await fetch(`https://api.themoviedb.org/3/${searchType}/${item.id}?language=de-DE`, options);
              const detailData = await detailRes.json();
              
              if (type === 'Movie' && detailData.runtime) maxProgress = `${detailData.runtime}m`;
              if (type === 'Series' && detailData.number_of_episodes) maxProgress = detailData.number_of_episodes;
            }
          } catch (e) {
            console.error("Detail fetch error", e);
          }

          return {
            title: item.title || item.name,
            type: type,
            posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            maxProgress: maxProgress
          };
        }));
        
        return detailedResults;
      }
    }

    // 2. Anime (Jikan API - No Key needed)
    if (type === 'Anime') {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      
      if (data.data) {
        return data.data.map(item => ({
          title: item.title,
          type: 'Anime',
          posterUrl: item.images?.jpg?.large_image_url || null,
          maxProgress: item.episodes || '?'
        }));
      }
    }

    // 3. Games (RAWG API)
    if (type === 'Game') {
      const res = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=5`);
      const data = await res.json();
      
      if (data.results) {
        return data.results.map(item => ({
          title: item.name,
          type: 'Game',
          posterUrl: item.background_image || null,
          maxProgress: null // Games have no definitive max length typically
        }));
      }
    }

    // 4. Books (OpenLibrary API - No Key needed)
    if (type === 'Book') {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      
      if (data.docs) {
        return data.docs.map(item => ({
          title: item.title,
          type: 'Book',
          posterUrl: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : null,
          maxProgress: item.number_of_pages_median || '?'
        }));
      }
    }

    return [];
  } catch (error) {
    console.error("Fehler bei der externen Suche:", error);
    return [];
  }
};
