import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import './Login.css'


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Safely destructure auth context with defaults
  const auth = useAuth() || {};
  const {
    login = () => Promise.resolve(false),
    error: authError = null,
    loading = false,
    isAuthenticated = false
  } = auth;

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login form error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <AcademicCapIcon className="login-icon" aria-hidden="true" />
          </div>
          <h2 className="login-title">
            Sign in to <span className="login-brand">SkillForge</span>
          </h2>
        </div>

        {/* Alerts - using authError instead of error */}
        {authError && (
          <div className="login-alert error-alert">
            <p className="alert-message">{authError}</p>
          </div>
        )}
        {message && (
          <div className="login-alert success-alert">
            <p className="alert-message">{message}</p>
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="register-link-text">
          Not a member?{' '}
          <Link to="/register" className="register-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}