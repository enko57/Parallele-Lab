import TrackerCard from './TrackerCard';

const TrackerGrid = ({ title, items, onEdit, onDelete }) => {
  if (!items || items.length === 0) return null;

  return (
    <section style={{ marginBottom: '40px' }}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="tracker-grid">
        {items.map((item) => (
          <TrackerCard 
            key={item.id} 
            item={item} 
            onClick={() => onEdit(item)} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </section>
  );
};

export default TrackerGrid;
