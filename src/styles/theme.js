// Design system - Human-crafted color palette
export const colors = {
  // Primary - Deep Indigo
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff', 
    200: '#c7d6fe',
    300: '#a5b8fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  // Secondary - Warm Coral
  secondary: {
    50: '#fff5f0',
    100: '#ffe8e0',
    200: '#ffd4c6',
    300: '#ffb8a3',
    400: '#ff8f73',
    500: '#ff6b4a',
    600: '#e8532e',
    700: '#c4411f',
    800: '#9e3518',
    900: '#7e2b12',
  },
  // Neutral - Warm Grays
  gray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  success: {
    light: '#dcfce7',
    main: '#22c55e',
    dark: '#166534',
  },
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#991b1b',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#92400e',
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#1e3a8a',
  },
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[700]} 100%)`,
  hero: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
  card: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)`,
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};