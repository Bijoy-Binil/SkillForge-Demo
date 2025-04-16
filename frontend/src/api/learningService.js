import apiClient from './client';

const learningService = {
  /**
   * Get all learning paths
   * @returns {Promise} - API response with learning paths
   */
  getLearningPaths: async () => {
    const response = await apiClient.get('/learning-paths/');
    return response.data;
  },

  /**
   * Get learning paths created by the current user
   * @returns {Promise} - API response with user's created learning paths
   */
  getMyCreatedPaths: async () => {
    const response = await apiClient.get('/learning-paths/my_created_paths/');
    return response.data;
  },

  /**
   * Get learning paths the user is enrolled in
   * @returns {Promise} - API response with user's enrolled learning paths
   */
  getMyEnrolledPaths: async () => {
    const response = await apiClient.get('/learning-paths/my_enrolled_paths/');
    return response.data;
  },

  /**
   * Generate a learning path using OpenAI
   * @param {string} goal - The learning goal (e.g., "Frontend Developer")
   * @param {number} durationWeeks - Duration in weeks
   * @returns {Promise} - API response with generated learning path
   */
  generateLearningPath: async (goal, durationWeeks = 4) => {
    const response = await apiClient.post('/learning-paths/generate/', {
      goal,
      duration_weeks: durationWeeks
    });
    return response.data;
  },

  /**
   * Get modules for a specific learning path
   * @param {number} pathId - Learning path ID
   * @returns {Promise} - API response with modules
   */
  getModulesByPath: async (pathId) => {
    const response = await apiClient.get(`/modules/by_path/?path_id=${pathId}`);
    return response.data;
  },

  /**
   * Mark a module as completed
   * @param {number} moduleId - Module ID
   * @param {number} timeSpentMinutes - Time spent on the module in minutes
   * @param {string} notes - Optional notes about the module
   * @returns {Promise} - API response with updated progress
   */
  markModuleCompleted: async (moduleId, timeSpentMinutes = 0, notes = '') => {
    const response = await apiClient.post('/module-progress/mark_completed/', {
      module_id: moduleId,
      time_spent_minutes: timeSpentMinutes,
      notes
    });
    return response.data;
  },

  /**
   * Get progress summary for a learning path
   * @param {number} pathId - Learning path ID
   * @returns {Promise} - API response with progress summary
   */
  getProgressSummary: async (pathId) => {
    const response = await apiClient.get(`/module-progress/summary/?path_id=${pathId}`);
    return response.data;
  },

  /**
   * Get learning time statistics
   * @param {number} days - Number of days to include in the stats
   * @returns {Promise} - API response with time stats
   */
  getLearningTimeStats: async (days = 7) => {
    const response = await apiClient.get(`/module-progress/time_stats/?days=${days}`);
    return response.data;
  }
};

export default learningService; 