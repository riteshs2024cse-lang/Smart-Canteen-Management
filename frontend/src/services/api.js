import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_STORAGE_KEY = 'smart_canteen_auth';

const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  const token = auth?.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  forgotPassword: (phone) => api.post('/auth/forgot-password', { phone }),
  resetPassword: (phone, code, newPassword) => api.post('/auth/reset-password', {
    phone,
    code,
    newPassword
  }),
};

// Food Log APIs
export const foodLogAPI = {
  // Get all food logs
  getAll: (params = {}) => api.get('/food-log', { params }),
  
  // Get single food log
  getById: (id) => api.get(`/food-log/${id}`),
  
  // Create food log
  create: (data) => api.post('/food-log', data),
  
  // Update food log
  update: (id, data) => api.put(`/food-log/${id}`, data),
  
  // Delete food log
  delete: (id) => api.delete(`/food-log/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: (params = {}) => api.get('/dashboard', { params }),
  
  // Get waste analysis
  getWasteAnalysis: () => api.get('/dashboard/waste-analysis'),
  
  // Get weekly trends
  getWeeklyTrends: () => api.get('/dashboard/weekly-trends'),
};

// Prediction APIs
export const predictionAPI = {
  // Get AI demand prediction
  getPrediction: (date) => api.get('/predict-demand', { params: date ? { date } : {} }),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getByUser: (userId) => api.get(`/bookings/user/${encodeURIComponent(userId)}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getAll: (params = {}) => api.get('/bookings', { params }),
  getStats: (params = {}) => api.get('/bookings/stats', { params }),
};

// Booking settings APIs
export const bookingSettingsAPI = {
  get: () => api.get('/booking-settings'),
  update: (data) => api.put('/booking-settings', data),
  toggle: () => api.post('/booking-settings/toggle'),
};

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
