import axios from 'axios';

// Default to local backend during development, or use VITE_API_BASE_URL in production (e.g. on Vercel)
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080'
).replace(/\/+$/, ''); // Strip trailing slashes if any

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
