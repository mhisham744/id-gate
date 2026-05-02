import { I18nManager } from 'react-native';

const isRTL = I18nManager.isRTL;

export const colors = {
  // Primary palette - vibrant indigo/violet
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  primaryGhost: 'rgba(99, 102, 241, 0.08)',
  primarySoft: 'rgba(99, 102, 241, 0.12)',

  secondary: '#06b6d4',
  secondaryDark: '#0891b2',
  accent: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',

  // Surfaces - clean whites with subtle warmth
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  card: '#ffffff',
  cardHover: '#f1f5f9',

  // Text hierarchy
  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textOnPrimary: '#ffffff',
  textOnDark: '#f8fafc',

  // Borders & dividers
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  divider: '#f1f5f9',

  // Status
  online: '#10b981',
  offline: '#94a3b8',
  away: '#f59e0b',

  // Identity types
  naturalCharacter: '#6366f1',   // Indigo for personal
  virtualCharacter: '#8b5cf6',   // Purple for position
  legalEntity: '#06b6d4',        // Cyan for organization

  // Gradient stops
  gradientStart: '#6366f1',
  gradientEnd: '#8b5cf6',
  gradientAccent: '#06b6d4',
} as const;

export const gradients = {
  primary: ['#6366f1', '#8b5cf6'] as const,
  hero: ['#4f46e5', '#7c3aed', '#6366f1'] as const,
  card: ['#ffffff', '#f8fafc'] as const,
  dark: ['#0f172a', '#1e293b'] as const,
  accent: ['#06b6d4', '#0891b2'] as const,
  warm: ['#f59e0b', '#ef4444'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  hero: { fontSize: 34, fontWeight: '800' as const, lineHeight: 40, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.2 },
  overline: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22, letterSpacing: 0.1 },
  buttonSmall: { fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
} as const;

export const shadows = {
  xs: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  shadows,
  isRTL,
} as const;
