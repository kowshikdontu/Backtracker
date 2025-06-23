import { useState } from 'react';
import { loginUser, forgotPassword } from '../api/auth.ts'; // Add forgotPassword API
import './login-form.css';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginUser(formData.username, formData.password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'An error occurred');
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

      {error && <div className="error-message mb-4">{error}</div>}
      {forgotSuccess && <div className="success-message mb-4">{forgotSuccess}</div>}

      {showForgotPassword ? (
        <form onSubmit={handleForgotSubmit}>
          <div className="mb-4">
          <p className='mb-6 text-sm'>Please enter your registered email address to receive the password reset link.</p>

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
                type="text"
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
                  Logging In...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="switch-button"
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
