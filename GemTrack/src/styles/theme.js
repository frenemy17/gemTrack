// Professional Dark Theme - Two Color Palette
export const colors = {
  // Primary Brand Color - Gold for jewelry theme
  primary: '#D4AF37',
  primaryLight: '#E5C158',
  primaryDark: '#B8941F',
  
  // Dark Background Palette
  background: '#0A0A0B',
  surface: '#141416',
  surfaceLight: '#1C1C1F',
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
  
  // Semantic Colors (only for analytics/status)
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  // Borders & Dividers
  border: '#27272A',
  divider: '#1C1C1F',
};

// Legacy colors object for backward compatibility
export const legacyColors = {
  primary: '#D4AF37',
  primaryDark: '#B8941F',
  secondary: '#A1A1AA',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#0A0A0B',
  card: '#141416',
  border: '#27272A',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
