import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  getPrediction: () => api.get('/predict-demand'),
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
