import axios from 'axios';
import type { MenuItem, Booking, LoginCredentials, Admin, AnalyticsReport } from '../types';

// Use the Vite proxy locally; deployments can provide a full API URL via VITE_API_URL.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Dev: log outgoing requests for easier debugging
  try {
    // avoid logging large FormData bodies
    const body = config.data && typeof config.data === 'object' && !(config.data instanceof FormData) ? JSON.parse(JSON.stringify(config.data)) : config.data;
    // eslint-disable-next-line no-console
    console.debug('[API request]', config.method?.toUpperCase(), config.url, body);
  } catch (e) {
    // ignore logging errors
  }
  return config;
});

// Log responses and response errors to make debugging easier in dev
api.interceptors.response.use(
  (res) => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[API response]', res.config?.url, res.status, res.data);
    } catch (e) { /* ignore */ }
    return res;
  },
  (err) => {
    // eslint-disable-next-line no-console
    console.error('API error:', err && err.response ? err.response.data || err.response.statusText : err.message);
    return Promise.reject(err);
  }
);

// API endpoints
export const menuApi = {
  getAll: () => api.get<MenuItem[]>('/menu'),
  getById: (id: string) => api.get<MenuItem>(`/menu/${id}`),
  add: (item: Partial<MenuItem>) => api.post<MenuItem>('/menu', item),
  update: (id: string, item: Partial<MenuItem>) => api.put<MenuItem>(`/menu/${id}`, item),
  delete: (id: string) => api.delete(`/menu/${id}`),
};

export const bookingApi = {
  create: (data: Omit<Booking, '_id' | 'createdAt' | 'status'>) => 
    api.post<Booking>('/bookings', data),
  getAll: () => api.get<Booking[]>('/bookings'),
  // get bookings for current user
  getMine: () => api.get<Booking[]>('/bookings/my'),
  // cancel a booking (user)
  cancel: (id: string) => api.patch<Booking>(`/bookings/${id}/cancel`),
  // update status; optional payload can include paymentAmount/paymentMethod etc.
  updateStatus: (id: string, status: Booking['status'], payload?: Record<string, any>) => 
    api.patch<Booking>(`/bookings/${id}/status`, { status, ...(payload || {}) }),
};

// Extend authApi with profile update
export const authApi = {
  signup: (payload: { userId: string; username?: string; mobile?: string; password: string }) =>
    api.post('/auth/signup', payload),
  login: (credentials: LoginCredentials) =>
    api.post<{ token: string; user?: any; admin?: Admin }>('/auth/login', credentials),
  getCurrentUser: () => api.get<Admin>('/auth/me'),
  updateProfile: (payload: any) => api.put('/auth/profile', payload),
};

export const orderApi = {
  create: (payload: { items: { itemId: string; qty: number }[]; customerName: string; phoneNumber: string; address?: string }) =>
    api.post('/orders', payload),
};

export const userApi = {
  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (itemId: string) => api.post('/user/favorites', { itemId }),
  removeFavorite: (itemId: string) => api.delete(`/user/favorites/${itemId}`),
};

export const messageApi = {
  send: (data: { name: string; email: string; phone: string; message: string }) =>
    api.post('/messages', data),
};

export const galleryApi = {
  getAll: () => api.get('/gallery'),
  add: (payload: { url: string; caption?: string }) => api.post('/gallery', payload),
  // upload expects FormData with field 'image'
  // send explicit header so axios does multipart form correctly (browser will set the boundary)
  upload: (form: FormData) => api.post('/gallery/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

export const adminApi = {
  getAnalytics: () => api.get<AnalyticsReport>('/admin/analytics'),
};

// authApi already exported above

export default api;
