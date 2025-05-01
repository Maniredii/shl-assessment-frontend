import axios from 'axios';

const BACKEND_URL = 'https://shl-assessment-backend-c8ug.onrender.com:10000';

// Create axios instance with the correct configuration
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
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
    // Log the full URL being called
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Making API request to:', fullUrl, {
      method: config.method,
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
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`
    };
    console.error('API Error Details:', errorDetails);

    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            error: `Network error: Unable to connect to ${BACKEND_URL}. Please check if the backend server is running.`
          }
        }
      });
    }

    return Promise.reject(error);
  }
); 