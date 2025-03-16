import { apiClient } from '../client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    // Add other user fields
  };
}

export const authService = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/login', credentials),
  
  register: (userData: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/register', userData),
    
  logout: () => apiClient.post('/auth/logout'),
}; 