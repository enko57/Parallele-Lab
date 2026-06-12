import { Link, useSearchParams } from 'react-router-dom';
import { Search, ListPlus } from 'lucide-react';
import '../App.css';

const Navbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';
  const query = searchParams.get('q') || '';

  const handleSearchChange = (e) => {
    const q = e.target.value;
    if (q) {
      searchParams.set('q', q);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  return (
    <nav className="navbar glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link to="/" className="nav-brand">
          <ListPlus size={26} color="var(--accent)" />
          MediaTracker
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${currentType === 'all' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/?type=Anime" className={`nav-link ${currentType === 'Anime' ? 'active' : ''}`}>Anime</Link>
          <Link to="/?type=Series" className={`nav-link ${currentType === 'Series' ? 'active' : ''}`}>Series</Link>
          <Link to="/?type=Movie" className={`nav-link ${currentType === 'Movie' ? 'active' : ''}`}>Movies</Link>
          <Link to="/?type=Book" className={`nav-link ${currentType === 'Book' ? 'active' : ''}`}>Books</Link>
          <Link to="/?type=Game" className={`nav-link ${currentType === 'Game' ? 'active' : ''}`}>Games</Link>
        </div>
      </div>
      
      <div className="nav-actions">
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px' }}>
          <Search size={16} style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Filter entries..." 
            value={query}
            onChange={handleSearchChange}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#fff', 
              outline: 'none', 
              marginLeft: '8px',
              fontSize: '0.9rem',
              width: '150px'
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
