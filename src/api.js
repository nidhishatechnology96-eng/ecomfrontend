// src/api.js

import axios from 'axios';

// Create a new Axios instance with a custom configuration
const apiClient = axios.create({
  // Get the base URL from the environment variables.
  // VITE_API_BASE_URL is the variable you set in the Render dashboard.
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;