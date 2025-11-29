/**
 * iOS Design System Constants
 * Shared values for all iOS wrapper components
 * Updated to ClearScore-inspired palette with automotive luxury crimson
 */

export const MAROON = "#0F81A3"; // ClearScore Teal (primary brand)
export const CRIMSON = "#A50010"; // Automotive Crimson (secondary brand)

export const IOS_COLORS = {
  maroon: MAROON, // Now teal
  crimson: CRIMSON,
  white: "#FFFFFF",
  black: "#1A1A1A",
  label: "#1A1A1A",
  labelSecondary: "#666666",
  labelTertiary: "#999999",
  separator: "rgba(15, 129, 163, 0.15)",
  systemBackground: "#E6F7FA", // Light teal background
  secondarySystemBackground: "#FFFFFF",
  tertiarySystemBackground: "#B8F9E9", // Light blue-teal
};

export const IOS_SHADOW = {
  shadowColor: '#0F81A3',
  shadowOpacity: 0.3,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
};

export const IOS_SHADOW_MAROON = {
  shadowColor: '#0F81A3',
  shadowOpacity: 0.35,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 12 },
  elevation: 12,
};

export const IOS_RADIUS = 12;
export const IOS_PADDING = 16;
export const IOS_MIN_TAP = 44;
export const IOS_SPACING = 12;
