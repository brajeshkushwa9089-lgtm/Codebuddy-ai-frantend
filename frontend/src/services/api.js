import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // 1. If an explicit production API URL is set, always use it
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // 2. If running locally on a private LAN network IP (e.g. 10.x, 192.168.x)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.')) {
      return `http://${host}:5000/api`;
    }
  }

  // 3. If running over HTTPS in production (e.g. Vercel), use configured URL or Render backend
  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') {
    return envUrl || 'https://codebuddy-ai-backend-s8m7.onrender.com/api';
  }

  // 4. Default to configured envUrl or local development
  return envUrl || 'http://localhost:5000/api';
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
    let message = error.response?.data?.error?.message || error.message || 'Network request failed';
    if (error.response?.status === 405) {
      message = 'Backend API is not configured on Vercel. Please set VITE_API_BASE_URL to your Render backend URL in Vercel Environment Variables.';
    }
    const customError = new Error(message);
    customError.statusCode = error.response?.status;
    customError.details = error.response?.data?.error?.details;
    return Promise.reject(customError);
  }
);

export default api;
