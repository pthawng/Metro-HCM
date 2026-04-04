// @ts-nocheck
import axios from 'axios';
import { BASE_URL } from '@/config';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Return only the data payload if present, otherwise return the whole data object
    // Standard response format: { success: true, data: ..., message: ... }
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                        originalRequest.url?.includes('/auth/register') ||
                        originalRequest.url?.includes('/auth/refresh-token');

    // Unauthorized - attempt token refresh (skip for auth routes)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint returns { success: true, data: { accessToken, refreshToken } }
        // Because of the success interceptor above, this will return the 'data' field directly
        const authData = await api.post('/auth/refresh-token');

        const { accessToken } = authData;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Standardize error message for components
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
