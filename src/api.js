import axios from 'axios';

const BACKEND_URL = 'https://shl-assessment-backend-c8ug.onrender.com';

// Create axios instance with the correct configuration
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60 seconds timeout since Render free tier can be slow to wake up
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

    if (error.response?.status === 0 || error.code === 'ERR_NETWORK') {
      return Promise.reject({
        response: {
          data: {
            error: 'CORS Error: The backend server is not accessible. This might be due to CORS restrictions or the server being down.'
          }
        }
      });
    }

    if (!error.response) {
      const errorMessage = error.code === 'ECONNABORTED'
        ? 'The request timed out. The backend server might be starting up (this can take up to 30 seconds on the free tier). Please try again.'
        : `Network error: Unable to connect to ${BACKEND_URL}. Please check if the backend server is running.`;
      
      return Promise.reject({
        response: {
          data: {
            error: errorMessage
          }
        }
      });
    }

    return Promise.reject(error);
  }
); 