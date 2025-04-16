import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login, error, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
    <div className="flex flex-col items-center">
      {/* Icon */}
      <div className="mb-3">
        <AcademicCapIcon className="h-10 w-10 text-primary-600" aria-hidden="true" />
      </div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
        Sign in to <span className="text-primary-600">SkillForge</span>
      </h2>
    </div>

    {/* Alerts */}
    {error && (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )}
    {message && (
      <div className="rounded-md bg-green-50 p-4">
        <p className="text-sm text-green-700">{message}</p>
      </div>
    )}

    {/* Form */}
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="text-sm">
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500 font-medium">
              Forgot password?
            </Link>
          </div>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>

    <p className="mt-6 text-center text-sm text-gray-500">
      Not a member?{' '}
      <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
        Create an account
      </Link>
    </p>
  </div>
</div>

  );
} 