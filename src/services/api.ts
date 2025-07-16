import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { LoginResponse, DemoCredentials } from '../types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (
  module: string,
  credentials: { email: string; password: string }
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(`/auth/${module}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error(`${module} login error:`, error);
    throw error;
  }
};

export const getDemoCredentials = async (module: string): Promise<DemoCredentials> => {
  try {
    const response = await api.get<DemoCredentials>(`/auth/${module}/demo-credentials`);
    return response.data;
  } catch (error) {
    console.error(`Error getting ${module} demo credentials:`, error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export default {
  login,
  logout,
  getDemoCredentials,
}; 