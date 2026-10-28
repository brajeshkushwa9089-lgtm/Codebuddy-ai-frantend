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

  // 3. Default to configured envUrl or localhost
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
    const errorData = error.response?.data?.error;
    const message = errorData?.message || error.message || 'Network request failed';
    const customError = new Error(message);
    customError.statusCode = error.response?.status;
    customError.details = errorData?.details;
    return Promise.reject(customError);
  }
);

export default api;
