import { Platform } from 'react-native';

let SecureStore: {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
};

if (Platform.OS === 'web') {
  // Use localStorage on web as fallback
  SecureStore = {
    getItemAsync: async (key: string) => localStorage.getItem(key),
    setItemAsync: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    deleteItemAsync: async (key: string) => {
      localStorage.removeItem(key);
    },
  };
} else {
  SecureStore = require('expo-secure-store');
}

export default SecureStore;
