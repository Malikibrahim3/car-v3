/**
 * iOS Spacing System
 * 8-point grid + Apple HIG standards
 */

export const iosSpacing = {
  // BASE SCALE (8pt grid)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  
  // SEMANTIC SPACING
  micro: 4,
  tight: 8,
  compact: 12,
  default: 16,
  comfortable: 24,
  loose: 32,
  section: 40,
  majorSection: 48,
  
  // COMPONENT SPACING
  cardPadding: 20,
  cardPaddingLarge: 24,
  cardGap: 16,
  
  listItemPadding: 16,
  listItemGap: 12,
  
  buttonPaddingVertical: 12,
  buttonPaddingHorizontal: 24,
  
  inputPaddingVertical: 12,
  inputPaddingHorizontal: 16,
  
  // SCREEN SPACING
  screenPaddingHorizontal: 20,
  screenPaddingVertical: 16,
  
  // TOUCH TARGETS (iOS minimum 44pt)
  touchTargetMin: 44,
  touchTargetComfortable: 48,
  
  // NAVIGATION
  navBarHeight: 44,
  navBarLargeTitleHeight: 96,
  tabBarHeight: 49,
  
  // SAFE AREAS (handled by SafeAreaView, but useful for reference)
  statusBarHeight: 44,
  bottomSafeArea: 34,
};

// Helper functions
export const spacing = {
  // Get spacing value
  get: (size) => iosSpacing[size] || iosSpacing.default,
  
  // Create padding object
  padding: (size) => ({
    padding: iosSpacing[size] || iosSpacing.default,
  }),
  
  paddingHorizontal: (size) => ({
    paddingHorizontal: iosSpacing[size] || iosSpacing.default,
  }),
  
  paddingVertical: (size) => ({
    paddingVertical: iosSpacing[size] || iosSpacing.default,
  }),
  
  // Create margin object
  margin: (size) => ({
    margin: iosSpacing[size] || iosSpacing.default,
  }),
  
  marginHorizontal: (size) => ({
    marginHorizontal: iosSpacing[size] || iosSpacing.default,
  }),
  
  marginVertical: (size) => ({
    marginVertical: iosSpacing[size] || iosSpacing.default,
  }),
  
  // Create gap
  gap: (size) => ({
    gap: iosSpacing[size] || iosSpacing.default,
  }),
};

export default iosSpacing;
