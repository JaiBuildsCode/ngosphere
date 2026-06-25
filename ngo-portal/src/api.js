import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
console.log(`🔌 API Base Path: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json' 
  }
});

// 1. THE REQUEST INTERCEPTOR (Upgraded)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Strict check: Only attach if it's an actual token, not a null/undefined string
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. THE RESPONSE INTERCEPTOR (The Damage Control)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // If backend throws 401 or 403, the token is dead or unauthorized.
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("🚨 Auth Failure: Token rejected by server. Purging local storage.");
      localStorage.removeItem('token'); 
      // window.location.href = '/login'; // Uncomment this later to auto-redirect
    }
    return Promise.reject(error);
  }
);

export default api;