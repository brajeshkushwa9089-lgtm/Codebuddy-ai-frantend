import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:5000/api`;
    }
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 65000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getAuthToken = () => null;

export const setTokenGetter = (fn) => {
  getAuthToken = fn;
};

// Request interceptor to attach bearer token and dynamic host
api.interceptors.request.use((config) => {
  config.baseURL = getBaseURL();
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for clear error unwrapping
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data?.error;
    const message = errorData?.message || error.message || 'Network request failed';
    const customError = new Error(message);
    customError.statusCode = error.response?.status;
    customError.details = errorData?.details;
    return Promise.reject(customError);
  }
);

export default api;
