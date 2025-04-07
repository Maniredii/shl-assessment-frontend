import axios from 'axios';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making API request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (!error.response) {
      const errorMessage = `Unable to connect to the backend server at ${API_URL}. Please ensure the server is running.`;
      console.error('Network Error:', errorMessage);
      return Promise.reject({
        response: {
          data: { error: errorMessage }
        }
      });
    }

    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }
); 