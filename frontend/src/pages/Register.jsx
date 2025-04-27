import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import './Register.css'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const { register, error, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    await register(formData);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <AcademicCapIcon className="register-icon" />
          <h2 className="register-title">Create an account</h2>
        </div>

        {error && (
          <div className="alert error-alert">
            <p className="alert-message">{error}</p>
          </div>
        )}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="login-link-text">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}