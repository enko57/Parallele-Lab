import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { updateMedia, deleteMedia } from '../api';

const EditMediaModal = ({ item, onClose, onUpdate }) => {
  const [status, setStatus] = useState(item.status);
  const [score, setScore] = useState(item.score === '-' ? '' : item.score);
  const [progress, setProgress] = useState(item.progress);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateMedia(item.id, {
      status,
      score: score || '-',
      progress
    });
    onUpdate();
    onClose();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteMedia(item.id);
    onUpdate();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit {item.title}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <img src={item.posterUrl} alt={item.title} style={{ width: '80px', borderRadius: '4px', objectFit: 'cover' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{item.title}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.type}</div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="planned">Plan to Experience</option>
              <option value="watching">Currently Experiencing</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Score (e.g. 1-10)</label>
              <input type="text" className="form-input" value={score} onChange={e => setScore(e.target.value)} placeholder="-" />
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Progress (e.g. 12/24)</label>
              <input type="text" className="form-input" value={progress} onChange={e => setProgress(e.target.value)} placeholder="0" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2, marginTop: 0 }}>Save Changes</button>
            <button type="button" className="btn-danger" onClick={handleDelete} style={{ flex: 1, marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMediaModal;
