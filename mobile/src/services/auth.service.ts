import api from './api';
import type {
  RegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  AuthResponse,
  ApiResponse,
} from '@idgate/shared';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  requestOtp: async (phoneNumber: string): Promise<ApiResponse<{ expiresIn: number }>> => {
    const response = await api.post('/auth/request-otp', { phoneNumber });
    return response.data;
  },
};
