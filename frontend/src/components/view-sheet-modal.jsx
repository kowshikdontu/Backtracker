import { useState } from 'react';
import { viewSheet } from '../api/auth';
import './password-modal.css';

const ViewSheetModal = ({ isOpen, onClose, onSheetLoaded }) => {
  const [formData, setFormData] = useState({
    username: '',
    accessCode: ''
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
      const sheetData = await viewSheet(formData.username, formData.accessCode);
      onSheetLoaded(sheetData, formData.username);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', accessCode: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '520px'}}>        
        <div className="modal-header mb-1">
          <h3 className="font-bold text-xl">View Others' Sheet</h3>
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
        
        <p className="mb-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Enter the username and access code to view someone else's problem sheet.
        </p>

        {error && (
          <div className="mb-4 p-md" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '5px',
            color: 'var(--error)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              Access Code *
            </label>
            <input
              type="password"
              name="accessCode"
              value={formData.accessCode}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter access code"
              required
            />
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
                  Loading...
                </div>
              ) : (
                'View Sheet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewSheetModal;