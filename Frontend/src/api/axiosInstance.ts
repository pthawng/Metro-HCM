import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { BASE_URL } from '@/config';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data payload if present, otherwise return the whole data object
    // Standard response format: { success: true, data: ..., message: ... }
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    const isAuthRoute = url.includes('/auth/login') || 
                        url.includes('/auth/register') ||
                        url.includes('/auth/refresh-token');

    // Unauthorized - attempt token refresh (skip for auth routes)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint returns { success: true, data: { accessToken, refreshToken } }
        // Because of the success interceptor above, this will return the 'data' field directly
        const authData = await api.post<{ accessToken: string }>('/auth/refresh-token');

        const { accessToken } = authData as any; // Temporary any until we have full types

        localStorage.setItem('accessToken', accessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

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
    const responseData = error.response?.data as any;
    const message = responseData?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
