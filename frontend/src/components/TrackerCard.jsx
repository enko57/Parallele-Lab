import '../App.css';

const TrackerCard = ({ item, onClick, onDelete }) => {
  return (
    <div className="tracker-card" onClick={onClick} style={{ position: 'relative' }}>
      <div className="poster-wrapper">
        <img src={item.posterUrl} alt={item.title} className="media-poster" />
        <div className="score-badge">
          {item.score}
        </div>
      </div>
      <div className="card-content">
        <div className="media-title" title={item.title}>{item.title}</div>
        
        <div className="media-meta">
          <span>{item.type}</span>
          <span>{item.progress}</span>
        </div>
        
        <div className="status-indicator">
          <span className={`status-dot status-${item.status}`}></span>
          <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
            {item.status === 'watching' ? (item.type === 'Game' ? 'Playing' : item.type === 'Book' ? 'Reading' : 'Watching') : item.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackerCard;
