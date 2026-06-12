import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TrackerGrid from '../components/TrackerGrid';
import AddMediaModal from '../components/AddMediaModal';
import EditMediaModal from '../components/EditMediaModal';
import { fetchTrackerData, deleteMedia } from '../api';
import { Plus } from 'lucide-react';

const Home = () => {
  const [searchParams] = useSearchParams();
  const currentType = searchParams.get('type') || 'all';
  
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    const result = await fetchTrackerData();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      await deleteMedia(item.id);
      loadData();
    }
  };

  // 1. Filter by Type (Tabs in Navbar)
  const filteredByType = data.filter(item => currentType === 'all' || item.type === currentType);

  // 2. Filter by Status
  const watching = filteredByType.filter(m => m.status === 'watching');
  const completed = filteredByType.filter(m => m.status === 'completed');
  const planned = filteredByType.filter(m => m.status === 'planned');
  const dropped = filteredByType.filter(m => m.status === 'dropped');

  const getTitle = () => {
    if (currentType === 'all') return 'My Dashboard';
    if (currentType === 'Anime') return 'Anime';
    return `${currentType}s`;
  };

  return (
    <div className="home-container">
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{getTitle()}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {currentType === 'all' 
              ? 'Track your Anime, Games, Books, and Movies.'
              : `Your personal library of tracked ${currentType.toLowerCase()}s.`
            }
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          style={{ 
            background: 'var(--accent)', 
            color: '#fff', 
            padding: '10px 16px', 
            borderRadius: '6px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
          <Plus size={20} /> Add Entry
        </button>
      </div>

      <TrackerGrid title="Currently Enjoying" items={watching} onEdit={setEditingItem} onDelete={handleDelete} />
      <TrackerGrid title="Plan to Experience" items={planned} onEdit={setEditingItem} onDelete={handleDelete} />
      <TrackerGrid title="Completed" items={completed} onEdit={setEditingItem} onDelete={handleDelete} />
      <TrackerGrid title="Dropped" items={dropped} onEdit={setEditingItem} onDelete={handleDelete} />

      {isAddModalOpen && (
        <AddMediaModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={loadData} 
        />
      )}

      {editingItem && (
        <EditMediaModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onUpdate={loadData} 
        />
      )}
    </div>
  );
};

export default Home;
