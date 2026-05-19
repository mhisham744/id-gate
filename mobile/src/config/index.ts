const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';

export const config = {
  api: {
    baseUrl: API_URL,
    timeout: 30000,
  },
  ws: {
    url: WS_URL,
  },
  auth: {
    tokenKey: 'idgate_access_token',
    refreshTokenKey: 'idgate_refresh_token',
  },
  app: {
    name: 'IDGate',
    version: '0.1.0',
  },
} as const;
