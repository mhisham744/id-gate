import axios from 'axios';
import SecureStore from '../utils/storage';
import { config } from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token
api.interceptors.request.use(
  async (requestConfig) => {
    const token = await SecureStore.getItemAsync(config.auth.tokenKey);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(config.auth.refreshTokenKey);
        if (!refreshToken) {
          // No refresh token — just reject silently, logout will handle cleanup
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
          refreshToken,
        });

        await SecureStore.setItemAsync(config.auth.tokenKey, data.data.accessToken);
        await SecureStore.setItemAsync(config.auth.refreshTokenKey, data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        await SecureStore.deleteItemAsync(config.auth.tokenKey);
        await SecureStore.deleteItemAsync(config.auth.refreshTokenKey);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
