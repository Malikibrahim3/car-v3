/**
 * Apple iOS Typography System - SF Pro
 * Matches Apple's Human Interface Guidelines exactly
 * Uses SF Pro Display for large text, SF Pro Text for body
 */

export const TYPOGRAPHY = {
  // Font Families (iOS uses different variants by size)
  fontFamily: 'SF Pro Display',      // For sizes 20pt and above
  fontFamilyText: 'SF Pro Text',     // For sizes below 20pt (better for small text)
  
  // iOS Text Styles (matching Apple's semantic sizes)
  largeTitle: 34,   // iOS Large Title (navigation bars)
  title1: 28,       // iOS Title 1
  title2: 22,       // iOS Title 2
  title3: 20,       // iOS Title 3
  headline: 17,     // iOS Headline (emphasized body)
  body: 17,         // iOS Body (standard text)
  callout: 16,      // iOS Callout (secondary content)
  subheadline: 15,  // iOS Subheadline
  footnote: 13,     // iOS Footnote
  caption1: 12,     // iOS Caption 1
  caption2: 11,     // iOS Caption 2
  
  // Custom sizes for financial data
  hero: 72,         // Hero numbers (portfolio value)
  display: 48,      // Large display numbers
  
  // Compatibility aliases (map to iOS semantic sizes)
  h1: 28,           // Maps to title1
  h2: 22,           // Maps to title2
  h3: 20,           // Maps to title3
  small: 15,        // Maps to subheadline
  caption: 12,      // Maps to caption1
  
  // iOS Font Weights (exact Apple values)
  ultraLight: '100' as const,
  thin: '200' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
  black: '900' as const,
  
  // Compatibility aliases for weights
  extrabold: '800' as const,  // Maps to heavy
  
  // iOS Letter Spacing (Apple uses tight tracking for large text)
  tight: -0.41,     // For large titles
  normal: 0,        // Standard
  wide: 0.38,       // For all caps labels
  wider: 0.5,       // Extra wide for emphasis
};

export type FontWeight = 
  | typeof TYPOGRAPHY.ultraLight 
  | typeof TYPOGRAPHY.thin 
  | typeof TYPOGRAPHY.light 
  | typeof TYPOGRAPHY.regular 
  | typeof TYPOGRAPHY.medium 
  | typeof TYPOGRAPHY.semibold 
  | typeof TYPOGRAPHY.bold 
  | typeof TYPOGRAPHY.heavy 
  | typeof TYPOGRAPHY.black;
