import { useState } from 'react';
import { registerUser } from '../api/auth';

import './register-form.css'

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accessCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

//     if (!formData.email.endsWith('@vitapstudent.ac.in')) {
//       setError('Please use your VIT-AP email address (@vitapstudent.ac.in)');
//       setIsLoading(false);
//       return;
//     }

    try {
      await registerUser({
        username: formData.email,
        password: formData.password,
        access_code: formData.accessCode || ""
      });
      setSuccess('Registration successful! Please check your email to verify your account.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-card">
      <p className="text-left font-bold text-xl mb-1">Sign up</p>
      <p className="text-left text-xs mb-6">
        Join the DSA problem sharing community
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="enter your mail"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            placeholder="Create a strong password"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label mb-1">
            Access Code
          </label>
          <input
            type="password"
            name="accessCode"
            value={formData.accessCode}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your sheet's access code"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="button-loading">
              <div className="spinner"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="switch-container">
        <p className="switch-text">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="switch-button"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;