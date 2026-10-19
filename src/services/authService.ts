import api from './api';
import type { AuthResponse, User } from '../types/auth';

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('porta_token', response.data.data.token);
      localStorage.setItem('porta_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('porta_token');
      localStorage.removeItem('porta_user');
    }
  },

  getStoredUser(): User | null {
    const data = localStorage.getItem('porta_user');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem('porta_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('porta_token');
  },
};
