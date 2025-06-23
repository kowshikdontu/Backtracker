import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { validateResetToken, resetPassword } from '../api/auth';

const ResetPasswordPage = () => {
  const [, setLocation] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || '';

  const [step, setStep] = useState('verify'); // verify | reset | done
  const [email, setEmail] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      await validateResetToken(token);
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Invalid token or email');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPwd);
      setStep('done');
      setTimeout(() => setLocation('/auth'), 2000);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-secondary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-xl)'
    }}>

      <div style={{ width: '100%', maxWidth: '500px' }} className="login-card">
        {error && <div className="error-message mb-4">{error}</div>}

        <p className="text-left font-bold text-xl mb-2">
          Reset Password
        </p>
        <p className='mb-6 text-sm'>Please enter your registered email and follow the steps to reset your password.</p>

        {step === 'verify' && (
          <>
            <label className="form-label mb-1">Registered Email</label>
            <input
              type="email"
              className="input-field mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
            <button
              className="submit-button mt-2"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <label className="form-label mb-1">New Password</label>
            <input
              type="password"
              className="input-field mb-4"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <label className="form-label mb-1">Confirm Password</label>
            <input
              type="password"
              className="input-field mb-4"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button
              className="submit-button mt-2"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <p>Password reset successful! Redirecting...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-xl">
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Built for VIT-AP students • Secure • Fast • Collaborative
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
