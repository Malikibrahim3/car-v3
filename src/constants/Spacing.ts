/**
 * Apple iOS Spacing System - Base 8pt Grid
 * Matches Apple's Human Interface Guidelines exactly
 * All values are multiples of 8 (or 4 for micro-spacing)
 */

export const SPACING = {
  // Micro spacing (4pt increments)
  xxs: 2,   // Hairline spacing
  xs: 4,    // Minimum touch spacing
  
  // Standard spacing (8pt increments)
  sm: 8,    // Compact spacing (inline elements, icon gaps)
  md: 12,   // List item vertical spacing
  base: 16, // Standard spacing (default padding, margins)
  lg: 20,   // Card/Section padding
  xl: 24,   // Large section spacing
  xxl: 32,  // Screen edge margins
  xxxl: 44, // Major section breaks (matches iOS nav bar height)
  
  // iOS-specific spacing
  screenPadding: 16,  // Standard screen edge padding
  cardPadding: 16,    // Standard card internal padding
  listItemHeight: 44, // Minimum touch target (Apple HIG)
  navBarHeight: 44,   // iOS navigation bar height
  tabBarHeight: 49,   // iOS tab bar height
};

// Helper for consistent spacing
export const spacing = (multiplier: number) => SPACING.base * multiplier;
