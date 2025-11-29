/**
 * Typography utilities for consistent SF Pro font application
 * Matches Apple's iOS Human Interface Guidelines
 */

import { TextStyle } from 'react-native';
import { TYPOGRAPHY } from '@/src/constants/Typography';

/**
 * Apply SF Pro font to any text style
 * Uses SF Pro Display for large text (≥20pt), SF Pro Text for smaller
 */
export const withSFPro = (style: TextStyle): TextStyle => {
  const fontSize = style.fontSize || TYPOGRAPHY.body;
  const fontFamily = fontSize >= 20 ? TYPOGRAPHY.fontFamily : TYPOGRAPHY.fontFamilyText;
  
  return {
    ...style,
    fontFamily,
  };
};

/**
 * iOS Text Styles - Matching Apple's semantic text styles
 */
export const textStyles = {
  // Financial/Hero Numbers
  hero: withSFPro({
    fontSize: TYPOGRAPHY.hero,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: TYPOGRAPHY.tight,
  }),
  
  display: withSFPro({
    fontSize: TYPOGRAPHY.display,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: TYPOGRAPHY.tight,
  }),
  
  // iOS Semantic Styles
  largeTitle: withSFPro({
    fontSize: TYPOGRAPHY.largeTitle,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: TYPOGRAPHY.tight,
  }),
  
  title1: withSFPro({
    fontSize: TYPOGRAPHY.title1,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  title2: withSFPro({
    fontSize: TYPOGRAPHY.title2,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  title3: withSFPro({
    fontSize: TYPOGRAPHY.title3,
    fontWeight: TYPOGRAPHY.semibold,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  headline: withSFPro({
    fontSize: TYPOGRAPHY.headline,
    fontWeight: TYPOGRAPHY.semibold,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  body: withSFPro({
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  bodyBold: withSFPro({
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semibold,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  callout: withSFPro({
    fontSize: TYPOGRAPHY.callout,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  subheadline: withSFPro({
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  footnote: withSFPro({
    fontSize: TYPOGRAPHY.footnote,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.normal,
  }),
  
  caption1: withSFPro({
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.wide,
  }),
  
  caption2: withSFPro({
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: TYPOGRAPHY.regular,
    letterSpacing: TYPOGRAPHY.wide,
  }),
};
