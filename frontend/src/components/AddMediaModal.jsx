import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { searchExternalAPI, addMedia } from '../api';

const AddMediaModal = ({ onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Movie');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Manual entry states
  const [manualTitle, setManualTitle] = useState('');
  const [manualPoster, setManualPoster] = useState('');
  const [status, setStatus] = useState('planned');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const data = await searchExternalAPI(query, type);
    setResults(data);
    setLoading(false);
  };

  const handleSelectResult = async (result) => {
    let initialProgress = '0';
    if (result.maxProgress && result.maxProgress !== '?') {
      initialProgress = `0/${result.maxProgress}`;
    }

    const newEntry = {
      title: result.title,
      type: result.type,
      posterUrl: result.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image',
      status: status,
      score: '-',
      progress: initialProgress
    };
    try {
      await addMedia(newEntry);
      onAdd();
      onClose();
    } catch (e) {
      alert("Fehler beim Speichern! Läuft das Backend (Docker)? Error: " + e.message);
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualTitle) return;
    const newEntry = {
      title: manualTitle,
      type: type,
      posterUrl: manualPoster || 'https://via.placeholder.com/200x300?text=No+Image',
      status: status,
      score: '-',
      progress: '0'
    };
    try {
      await addMedia(newEntry);
      onAdd();
      onClose();
    } catch (e) {
      alert("Fehler beim Speichern! Läuft das Backend (Docker)? Error: " + e.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add to Library</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Media Type</label>
          <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
            <option value="Anime">Anime</option>
            <option value="Game">Game</option>
            <option value="Book">Book</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Initial Status</label>
          <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="planned">Plan to Experience</option>
            <option value="watching">Currently Experiencing</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div style={{ borderTop: '1px solid #30363d', margin: '10px 0' }}></div>

        {/* Search Section */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by title..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Search size={18} /> Search
          </button>
        </form>

        {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching...</p>}

        {results.length > 0 && (
          <div className="search-results">
            {results.map((r, i) => (
              <div key={i} className="search-result-item" onClick={() => handleSelectResult(r)}>
                <img src={r.posterUrl || 'https://via.placeholder.com/40x60'} alt={r.title} className="search-result-poster" />
                <div>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {r.type} {r.maxProgress ? `• ${r.maxProgress} ${r.type === 'Book' ? 'Seiten' : r.type === 'Movie' ? '' : 'Folgen'}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid #30363d', margin: '10px 0', textAlign: 'center' }}>
          <span style={{ backgroundColor: 'var(--bg-card)', padding: '0 10px', position: 'relative', top: '-10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>OR MANUAL ENTRY</span>
        </div>

        <form onSubmit={handleManualAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={manualTitle} onChange={e => setManualTitle(e.target.value)} placeholder="E.g. The Lord of the Rings" />
          </div>
          <div className="form-group">
            <label className="form-label">Poster URL (Optional)</label>
            <input type="text" className="form-input" value={manualPoster} onChange={e => setManualPoster(e.target.value)} placeholder="https://..." />
          </div>
          <button type="submit" className="btn-primary">Add Manually</button>
        </form>

      </div>
    </div>
  );
};

export default AddMediaModal;
