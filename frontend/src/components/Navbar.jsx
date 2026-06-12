import { Link, useSearchParams } from 'react-router-dom';
import { Search, User, ListPlus } from 'lucide-react';
import '../App.css';

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';

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
        <Search size={18} style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <User size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
