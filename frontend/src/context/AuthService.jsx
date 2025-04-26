// authService.js
const authService = {
  isAuthenticated() {
    // Check if the token exists in local storage or session
    return !!localStorage.getItem('token');
  },

  login(email, password) {
    // Example login logic using an API (you can replace this with your actual API call)
    return fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Save token to localStorage (or use other storage)
        localStorage.setItem('token', data.token);
      });
  },

  register(userData) {
    // Registration logic (replace with your API endpoint)
    return fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser() {
    // Retrieve current user from the API using the token
    const token = localStorage.getItem('token');
    if (!token) return null;

    return fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json());
  },

  logout() {
    // Clear token from localStorage on logout
    localStorage.removeItem('token');
  },
};

export default authService;
