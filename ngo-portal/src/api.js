import axios from 'axios';

/**
 * INTELLIGENT API CLIENT
 * - Uses Environment Variables for flexibility.
 * - Defaults to relative paths in production for monolithic builds.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

console.log(`🔌 API Base Path: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to automatically attach JWT tokens if they exist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;