import apiClient from './client';

const authService = {
  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - API response with tokens
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/jwt/create/', { email, password });
    if (response.data.access) {
      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response with user data
   */
  register: async (userData) => {
    // Format the data according to djoser's expected structure
    const formattedData = {
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      password: userData.password,
      re_password: userData.confirmPassword
    };
    
    const response = await apiClient.post('/auth/users/', formattedData);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} - API response with user data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/users/me/');
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has an auth token
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Refresh the access token using refresh token
   * @returns {Promise} - API response with new access token
   */
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post('/auth/jwt/refresh/', {
      refresh: refreshToken
    });
    
    if (response.data.access) {
      localStorage.setItem('authToken', response.data.access);
    }
    
    return response.data;
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise} - API response with updated user data
   */
  updateProfile: async (userData) => {
    const response = await apiClient.patch('/auth/users/me/', userData);
    return response.data;
  }
};

export default authService; 