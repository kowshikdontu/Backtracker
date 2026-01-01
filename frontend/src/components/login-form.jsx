import { useState } from 'react';
import { loginUser, forgotPassword } from '../api/auth.ts';
import './login-form.css';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // New state to track if we suspect a cold start
  const [isColdStart, setIsColdStart] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setIsColdStart(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsColdStart(false);

    try {
      await loginUser(formData.username, formData.password);
      onSuccess();
    } catch (err) {
      console.error("Login Error:", err);

      // 🔍 DETECT RENDER COLD START
      if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("Network Error"))) {
        setError(" Render server is down due to inactivity, please click login multiple times to wake up it");
        setIsColdStart(true);
      } else {
        // Standard error (wrong password, user not found, etc.)
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setForgotSuccess('');

    try {
      await forgotPassword(forgotEmail);
      setForgotSuccess('Check your email for reset instructions.');
      setForgotEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <p className="text-left font-bold text-xl mb-6">
        {showForgotPassword ? 'Reset Password' : 'Sign in'}
      </p>

      {/* ERROR MESSAGE BOX */}
      {error && (
        <div className={`mb-4 p-3 rounded text-sm ${isColdStart ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50' : 'error-message'}`}>
          {isColdStart ? (
            <div className="flex items-start gap-2">
              <span className="text-xl">☕</span>
              <div>
                <strong>Server Napping:</strong><br/>
                Render (Free Tier) spins down inactive servers. Give it a moment to wake up, then click Login again!
              </div>
            </div>
          ) : (
            error
          )}
        </div>
      )}

      {forgotSuccess && <div className="success-message mb-4">{forgotSuccess}</div>}

      {showForgotPassword ? (
        <form onSubmit={handleForgotSubmit}>
          <div className="mb-4">
            <p className='mb-6 text-sm text-gray-300'>Please enter your registered email address to receive the password reset link.</p>

            <label className="form-label mb-1">Registered Email</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="submit-button mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-sm mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
                setForgotSuccess('');
              }}
              className="switch-button"
            >
              Back to Login
            </button>
          </div>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label mb-1">Email</label>
              <input
                type="text" // Changed from email to text to allow usernames if needed
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="switch-button text-sm"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="submit-button mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner"></div>
                  {isColdStart ? 'Waking Server...' : 'Logging In...'}
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="switch-button font-bold text-white hover:text-purple-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm;