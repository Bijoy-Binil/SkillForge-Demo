import apiClient from './client';

const authService = {
  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - API response with tokens
   */
  login: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await apiClient.post('/auth/jwt/create/', { 
        email, 
        password 
      });
      
      if (response.data.access) {
        localStorage.setItem('authToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response with user data
   */
  register: async (userData) => {
    try {
      if (!userData.email || !userData.password || !userData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

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
    } catch (error) {
      if (error.response?.data) {
        // Handle specific validation errors
        const errors = error.response.data;
        if (errors.email) {
          throw new Error(errors.email[0]);
        }
        if (errors.password) {
          throw new Error(errors.password[0]);
        }
        if (errors.non_field_errors) {
          throw new Error(errors.non_field_errors[0]);
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - API response with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/users/me/');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
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
    try {
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
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Session expired. Please login again.');
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise} - API response with updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.patch('/auth/users/me/', userData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw new Error(Object.values(error.response.data)[0]);
      }
      throw new Error('Failed to update profile');
    }
  }
};

export default authService; 