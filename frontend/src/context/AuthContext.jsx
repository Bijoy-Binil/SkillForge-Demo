import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Load user data on initial load if authenticated
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          setLoading(true);
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setLoading(false);
        return true;
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
        setError('Login successful but failed to fetch user profile. Please try again.');
        authService.logout();
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      return false;
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 