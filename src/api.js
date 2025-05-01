import axios from 'axios';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://shl-assessment-backend-c8ug.onrender.com';

// Create axios instance with the correct base URL
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    // Remove any duplicate /api prefixes
    if (config.url.startsWith('/api')) {
      config.url = config.url.replace('/api', '');
    }
    
    console.log('Making API request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data,
      config: error.config
    });

    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            error: `Network error: Unable to connect to the backend server at ${API_URL}. Please ensure the server is running and CORS is properly configured.`
          }
        }
      });
    }

    return Promise.reject(error);
  }
); 