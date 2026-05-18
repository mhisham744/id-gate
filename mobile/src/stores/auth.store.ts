import { create } from 'zustand';
import SecureStore from '../utils/storage';
import { config } from '../config';
import { authService } from '../services/auth.service';
import type { NaturalCharacter } from '@idgate/shared';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accountType: 'personal' | 'organization';
  user: {
    id: string;
    idCode: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profilePhotoUrl?: string;
  } | null;

  // Active identity for communication
  activeIdentity: {
    id: string;
    type: 'natural' | 'virtual';
    displayName: string;
  } | null;

  // Actions
  initialize: () => Promise<void>;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (data: {
    phoneNumber: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality1: string;
    residenceCountry: string;
    password: string;
    accountType?: 'personal' | 'organization';
  }) => Promise<void>;
  logout: () => Promise<void>;
  setActiveIdentity: (identity: AuthState['activeIdentity']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  accountType: 'personal',
  user: null,
  activeIdentity: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(config.auth.tokenKey);
      const storedType = await SecureStore.getItemAsync('accountType');
      const accountType = (storedType === 'organization' ? 'organization' : 'personal') as 'personal' | 'organization';
      if (token) {
        set({ isAuthenticated: true, isLoading: false, accountType });
      } else {
        set({ isAuthenticated: false, isLoading: false, accountType });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (phoneNumber, password) => {
    const response = await authService.login({ phoneNumber, password });
    if (response.success && response.data) {
      await SecureStore.setItemAsync(config.auth.tokenKey, response.data.accessToken);
      await SecureStore.setItemAsync(config.auth.refreshTokenKey, response.data.refreshToken);
      const storedType = await SecureStore.getItemAsync('accountType');
      const accountType = (storedType === 'organization' ? 'organization' : 'personal') as 'personal' | 'organization';
      set({
        isAuthenticated: true,
        accountType,
        user: response.data.user,
        activeIdentity: {
          id: response.data.user.id,
          type: 'natural',
          displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
        },
      });
    }
  },

  register: async (data) => {
    const response = await authService.register(data);
    if (response.success && response.data) {
      await SecureStore.setItemAsync(config.auth.tokenKey, response.data.accessToken);
      await SecureStore.setItemAsync(config.auth.refreshTokenKey, response.data.refreshToken);
      const accountType = data.accountType || 'personal';
      await SecureStore.setItemAsync('accountType', accountType);
      set({
        isAuthenticated: true,
        accountType,
        user: response.data.user,
        activeIdentity: {
          id: response.data.user.id,
          type: 'natural',
          displayName: `${response.data.user.firstName} ${response.data.user.lastName}`,
        },
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      await SecureStore.deleteItemAsync(config.auth.tokenKey);
      await SecureStore.deleteItemAsync(config.auth.refreshTokenKey);
      await SecureStore.deleteItemAsync('accountType');
      set({ isAuthenticated: false, user: null, activeIdentity: null, accountType: 'personal' });
    }
  },

  setActiveIdentity: (identity) => set({ activeIdentity: identity }),
}));
