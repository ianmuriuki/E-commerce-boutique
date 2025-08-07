import axios from 'axios';
import api from './api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id?: string;
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('Signing up with data:', { ...data, password: '***' });
    const response = await api.post('/auth/register', data);
    if (response.data.data.accessToken) {
      this.setAuthToken(response.data.data.accessToken);
    }
    console.log('Signup response:', response.data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('Logging in with:', { ...data, password: '***' });
    const response = await api.post('/auth/login', data);
    if (response.data.data.accessToken) {
      this.setAuthToken(response.data.data.accessToken);
    }
    console.log('Login response:', response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  setAuthToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    const response = await api.patch('/auth/profile', data);
    if (response.data.success) {
      // Update the stored user data
      const currentUser = JSON.parse(localStorage.getItem('luxora_user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data.user };
      localStorage.setItem('luxora_user', JSON.stringify(updatedUser));
    }
    return response.data;
  }
};
