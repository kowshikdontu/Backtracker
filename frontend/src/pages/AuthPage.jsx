import { useState } from 'react';
import { useLocation } from 'wouter';
import LoginForm from '../components/login-form.jsx';
import RegisterForm from '../components/register-form.jsx';
import { isAuthenticated } from '../api/auth';

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    setLocation('/dashboard');
    return null;
  }

  const handleLoginSuccess = () => {
    setLocation('/dashboard');
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
      {/* Header */}
      <div className="text-center mb-xl">
        <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
          BACKTRACKER
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          lineHeight: 1.6
        }}>
          Your ultimate platform for managing and sharing Data Structures & Algorithms problem sheets
        </p>
      </div>

      {/* Auth Form */}
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {isLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setIsLogin(true)}
          />
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

export default AuthPage;
