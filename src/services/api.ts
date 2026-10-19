import axios from 'axios';

/**
 * Safely decodes a base64url-encoded string supporting UTF-8 multi-byte characters.
 */
function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Decodes an RFC 7519 JWT string to its payload object.
 */
function unpackJwtPayload(tokenStr: string): any {
  const parts = tokenStr.split('.');
  if (parts.length !== 3) return null;
  const jsonStr = decodeBase64Url(parts[1]);
  return JSON.parse(jsonStr);
}

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
  (response) => {
    // If response.data.data is a signed JWT string, automatically unwrap and hydrate the payload
    if (
      response.data &&
      typeof response.data.data === 'string' &&
      response.data.data.startsWith('eyJ')
    ) {
      try {
        const decoded = unpackJwtPayload(response.data.data);
        if (decoded && decoded.payload) {
          const p = decoded.payload;
          response.data.data = p.data !== undefined ? p.data : p;
          if (p.dataset !== undefined && p.dataset !== null) {
            response.data.dataset = p.dataset;
          }
          if (p.pagination !== undefined && p.pagination !== null) {
            response.data.pagination = p.pagination;
          }
          if (p.summary !== undefined && p.summary !== null) {
            response.data.summary = p.summary;
          }
        }
      } catch (err) {
        console.error('Failed to unpack JWT response payload:', err);
      }
    }
    return response;
  },
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
