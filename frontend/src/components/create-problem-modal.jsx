import { useState } from 'react';
import { createProblem } from '../api/auth';

const CreateProblemModal = ({ isOpen, onClose, onProblemCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    tags: '',
    difficulty: 'easy'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const newProblem = await createProblem(formData);
      onProblemCreated(newProblem);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', url: '', tags: '', difficulty: 'easy' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} >
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '520px'}}>
        <div className="modal-header">
          <h3 className="font-bold text-xl">Add New Problem</h3>
          <button
            onClick={handleClose}
            className="close-btn"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-md p-md" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--error)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ display: 'block' }}>
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter problem title"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ display: 'block' }}>
              Problem URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ display: 'block' }}>
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="array, string, dynamic-programming (comma-separated)"
            />
            <p className="text-xs mt-sm" style={{ color: 'var(--text-muted)' }}>
              Separate multiple tags with commas
            </p>
          </div>

          <div className="flex gap-4 items-center mb-4">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              Difficulty *
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="small-select"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex gap-md">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-sm">
                  <div className="spinner"></div>
                  Creating...
                </div>
              ) : (
                'Create Problem'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblemModal;