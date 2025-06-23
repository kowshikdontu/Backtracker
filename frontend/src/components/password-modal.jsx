import { useState, useEffect } from 'react';
import { changePassword } from '../api/auth';
import './password-modal.css';

const PasswordModal = ({ isOpen, onClose, isAccessCode = false }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Disable background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await changePassword(formData.oldPassword, formData.newPassword, isAccessCode);
      setSuccess(`${isAccessCode ? 'Access code' : 'Password'} updated successfully!`);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-bold text-xl">Change {isAccessCode ? 'Access Code' : 'Password'}</h3>
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

        {success && (
          <div className="mb-md p-md" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--success)'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              Current {isAccessCode ? 'Access Code' : 'Password'}
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="input-field"
              placeholder={`Enter current ${isAccessCode ? 'access code' : 'password'}`}
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              New {isAccessCode ? 'Access Code' : 'Password'}
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="input-field"
              placeholder={`Enter new ${isAccessCode ? 'access code' : 'password'}`}
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium mb-sm" style={{ display: 'block' }}>
              Confirm New {isAccessCode ? 'Access Code' : 'Password'}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder={`Confirm new ${isAccessCode ? 'access code' : 'password'}`}
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
                  Updating...
                </div>
              ) : (
                `Update ${isAccessCode ? 'Access Code' : 'Password'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
