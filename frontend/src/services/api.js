import axios from 'axios';

// Make sure this environment variable is properly set in Vercel
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('Using API URL:', API_URL); // Add this for debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Add this to handle CORS issues
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getProfile = () => api.get('/auth/profile');
export const updateSubjects = (subjects) => api.patch('/auth/subjects', { subjects });

// Attendance API
export const markAttendance = (date, subjects) => api.post('/attendance', { date, subjects });
export const getAttendance = (date) => api.get(`/attendance/date/${date}`);
export const getAttendanceStats = () => api.get('/attendance/stats');
export const getAttendanceHistory = (startDate, endDate) => 
  api.get('/attendance/history', { params: { startDate, endDate } });

// Subjects API
export const getSubjects = () => api.get('/subjects');
export const addSubject = (subject) => api.post('/subjects', { subject });
export const deleteSubject = (subject) => api.delete(`/subjects/${subject}`);

export default api;
