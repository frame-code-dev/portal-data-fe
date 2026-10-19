import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '3180' ? '/api' : 'http://localhost:8180/api'),
  headers: {
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('porta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('porta_token');
      localStorage.removeItem('porta_user');
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
