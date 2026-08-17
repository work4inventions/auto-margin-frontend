import axios from 'axios';
import Cookies from 'js-cookie';

// Use environment variables with fallbacks
export const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // ✅ Added header
  },
  withCredentials: true
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ Ensure ngrok header is always present
    config.headers['ngrok-skip-browser-warning'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh logic for login & forgot-password endpoints - let those pages handle their own errors
    const isLoginRequest = originalRequest?.url?.includes('/api/v1/user/login');
    const isForgotPasswordRequest = originalRequest?.url?.includes('/api/v1/user/forgot-password/');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isForgotPasswordRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');
      
      if (!refreshToken) {
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/api/v1/user/refresh-token`, {
          refreshToken: refreshToken
        }, {
          headers: {
            'ngrok-skip-browser-warning': 'true' // ✅ Added for refresh API as well
          }
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        Cookies.set('auth_token', accessToken);
        Cookies.set('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.remove('auth_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
