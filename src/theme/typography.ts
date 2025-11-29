/**
 * Typography Scale - iOS-Compliant
 * Based on SF Pro system font
 */

export const typography = {
  // Display - Hero numbers and major headings
  displayLarge: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  displayMedium: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: -1,
    fontFamily: 'System',
  },
  
  // Titles - Section headers and card titles
  titleLarge: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    fontFamily: 'System',
  },
  titleMedium: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    fontFamily: 'System',
  },
  titleSmall: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    fontFamily: 'System',
  },
  
  // Body - Main content text
  bodyLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
    fontFamily: 'System',
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
    fontFamily: 'System',
  },
  
  // Captions - Labels and secondary text
  captionLarge: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: 0,
    fontFamily: 'System',
  },
  captionSmall: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    fontFamily: 'System',
  },
};

export default typography;
