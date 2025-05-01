import axios from 'axios';

// Create axios instance with the correct configuration
export const axiosInstance = axios.create({
  baseURL: '',  // Use relative URLs
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
    // Ensure the URL starts with /recommend
    if (config.url.includes('recommend') && !config.url.startsWith('/recommend')) {
      config.url = '/recommend';
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
            error: 'Network error: Unable to connect to the backend server. Please try again.'
          }
        }
      });
    }

    return Promise.reject(error);
  }
); 