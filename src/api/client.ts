import axios from 'axios';
import { apiConfig } from './config';

// Create axios instance with base configuration
export const apiClient = axios.create(apiConfig);

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 