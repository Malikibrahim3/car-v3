/**
 * iOS Shadow System
 * Apple-style layered shadows
 */

export const iosShadows = {
  // SMALL - Subtle elevation
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // MEDIUM - Standard cards
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // LARGE - Elevated cards
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 8,
  },
  
  // XLARGE - Modals and overlays
  xlarge: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 12,
  },
  
  // COLORED SHADOWS - For accent elements
  maroon: {
    shadowColor: '#7A001F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8,
  },
  
  positive: {
    shadowColor: '#30D158',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 4,
  },
  
  negative: {
    shadowColor: '#FF453A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Helper to apply shadow
export const applyShadow = (size = 'medium') => {
  return iosShadows[size] || iosShadows.medium;
};

// Layered shadow (for premium effect)
export const layeredShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.20,
  shadowRadius: 24,
  elevation: 8,
};

export default iosShadows;
