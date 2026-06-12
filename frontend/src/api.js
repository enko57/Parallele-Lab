const STORAGE_KEY = 'mediatracker_data_v2';

const INITIAL_DATA = [
  { id: 1, title: 'Steins;Gate', type: 'Anime', status: 'completed', score: 9.8, progress: '24/24', posterUrl: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg' },
  { id: 2, title: 'The Legend of Zelda: Breath of the Wild', type: 'Game', status: 'watching', score: 9.5, progress: '65h', posterUrl: 'https://media.rawg.io/media/games/10d/10d19e52e5e8415d16a4d344fe711874.jpg' },
  { id: 3, title: 'Dune (Book 1)', type: 'Book', status: 'planned', score: '-', progress: '0/896', posterUrl: 'https://covers.openlibrary.org/b/id/10521270-L.jpg' },
  { id: 4, title: 'Breaking Bad', type: 'Series', status: 'completed', score: 10, progress: '62/62', posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg' },
  { id: 5, title: 'Cyberpunk 2077', type: 'Game', status: 'completed', score: 8.5, progress: '100%', posterUrl: 'https://media.rawg.io/media/games/26d/26d440e0ee42d198d022b7a9de7ec405.jpg' },
  { id: 6, title: 'One Piece', type: 'Anime', status: 'watching', score: 8.8, progress: '1074/?', posterUrl: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
  { id: 7, title: 'Inception', type: 'Movie', status: 'completed', score: 9.0, progress: '1/1', posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adZA2GLz2SXGieGTXC6111.jpg' }
];

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
}

export const fetchTrackerData = async () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addMedia = async (entry) => {
  const data = await fetchTrackerData();
  const newEntry = { ...entry, id: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...data]));
  return newEntry;
};

export const updateMedia = async (id, updates) => {
  const data = await fetchTrackerData();
  const updatedData = data.map(item => String(item.id) === String(id) ? { ...item, ...updates } : item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const deleteMedia = async (id) => {
  const data = await fetchTrackerData();
  const filteredData = data.filter(item => String(item.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
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
