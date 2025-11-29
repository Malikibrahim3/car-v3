/**
 * iOS Typography System
 * SF Pro Display / SF Pro Text Scale
 */

export const iosTypography = {
  // DISPLAY - Large hero text
  displayLarge: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold',
    letterSpacing: -1.5,
  },
  displayMedium: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  displaySmall: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  
  // TITLE - Section headers
  titleLarge: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  titleSmall: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  
  // BODY - Regular content
  bodyLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0,
  },
  
  // CAPTION - Small labels
  captionLarge: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  captionMedium: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  
  // SPECIAL - Numbers and data
  numberHero: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  numberLarge: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold',
    letterSpacing: -1.5,
  },
  numberMedium: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '600',
    letterSpacing: -1,
  },
  numberSmall: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
};

// Helper to create text style
export const createTextStyle = (variant) => {
  return iosTypography[variant] || iosTypography.bodyMedium;
};

// iOS Large Title (Navigation)
export const iosLargeTitle = {
  fontSize: 34,
  lineHeight: 41,
  fontWeight: 'bold',
  letterSpacing: -1,
};

// iOS Navigation Title
export const iosNavigationTitle = {
  fontSize: 17,
  lineHeight: 22,
  fontWeight: '600',
  letterSpacing: -0.2,
};

export default iosTypography;
