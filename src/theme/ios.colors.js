/**
 * iOS Premium Color System - Apple Porcelain Light Mode
 * Crimson Primary + Apple HIG Standards
 */

export const iosColors = {
  // PRIMARY - ClearScore Teal
  maroon: '#0F81A3', // Now teal (keeping name for compatibility)
  maroonDark: '#0A5A75',
  maroonLight: '#3DA3C7',
  maroonSubtle: 'rgba(15, 129, 163, 0.1)',
  maroonBorder: 'rgba(15, 129, 163, 0.2)',
  maroonGradientStart: '#0F81A3',
  maroonGradientEnd: '#0A5A75',
  
  // SECONDARY - Automotive Crimson
  crimson: '#A50010',
  crimsonDark: '#7A000C',
  crimsonLight: '#DC2626',
  crimsonSubtle: 'rgba(165, 0, 16, 0.1)',
  crimsonBorder: 'rgba(165, 0, 16, 0.2)',
  
  // SURFACES - ClearScore Light Teal Mode
  background: '#E6F7FA', // Light teal (NO plain white)
  elevated: '#FFFFFF',   // Pure white cards
  elevated2: '#F0FBFD',  // Very light teal
  elevated3: '#B8F9E9',  // Light blue-teal
  
  // TEXT - Dark on Light Teal
  label: '#1A1A1A',      // Near black
  labelSecondary: '#666666', // Medium grey
  labelTertiary: '#999999',  // Light grey
  labelQuaternary: '#CCCCCC', // ClearScore grey
  
  // SEMANTIC - ClearScore Pastels
  systemGreen: '#7BC96F',    // Soft green
  systemGreenLight: '#CFF9B8', // Light green pastel
  systemRed: '#E74C3C',
  systemRedLight: '#F9B8B8',   // Light red/pink pastel
  systemYellow: '#F9DCB8',     // Soft peach/orange pastel
  systemBlue: '#0F81A3',       // ClearScore teal
  systemBlueLight: '#B8F9E9',  // Light blue-teal pastel
  systemOrange: '#F9DCB8',
  systemPurple: '#D2B8F9',     // Purple/lavender pastel
  systemPink: '#F9B8B8',
  systemTeal: '#0F81A3',
  
  // FILLS - Light Mode Fills
  fill: 'rgba(0, 0, 0, 0.05)',
  fillSecondary: 'rgba(0, 0, 0, 0.04)',
  fillTertiary: 'rgba(0, 0, 0, 0.03)',
  fillQuaternary: 'rgba(0, 0, 0, 0.02)',
  
  // GLASS - Light Mode Glassmorphism
  glassLight: 'rgba(255, 255, 255, 0.6)',
  glassMedium: 'rgba(255, 255, 255, 0.8)',
  glassStrong: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',
  
  // SEPARATORS - Light Mode
  separator: 'rgba(0, 0, 0, 0.1)',
  separatorOpaque: '#E5E7EB',
  
  // PURE
  white: '#FFFFFF',
  black: '#111827',
};

// Semantic color mapping
export const iosSemanticColors = {
  positive: iosColors.systemGreen,
  negative: iosColors.systemRed,
  warning: iosColors.systemYellow,
  info: iosColors.systemBlue,
  
  success: iosColors.systemGreen,
  error: iosColors.systemRed,
  alert: iosColors.systemOrange,
};

// Component-specific colors
export const iosComponentColors = {
  // Cards
  cardBackground: iosColors.elevated,
  cardBackgroundElevated: iosColors.elevated2,
  cardBorder: iosColors.glassBorder,
  
  // Buttons
  buttonPrimary: iosColors.maroon,
  buttonPrimaryPressed: iosColors.maroonDark,
  buttonSecondary: iosColors.elevated2,
  buttonSecondaryPressed: iosColors.elevated3,
  
  // Inputs
  inputBackground: iosColors.fillTertiary,
  inputBorder: iosColors.separator,
  inputBorderFocused: iosColors.maroon,
  
  // Navigation
  navBackground: iosColors.elevated,
  navBorder: iosColors.separator,
  
  // Tab Bar
  tabBarBackground: iosColors.elevated,
  tabBarBorder: iosColors.separator,
  tabBarActive: iosColors.maroon,
  tabBarInactive: iosColors.labelTertiary,
};

export default iosColors;
