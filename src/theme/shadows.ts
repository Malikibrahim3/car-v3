/**
 * Shadow System - Dark Teal Glow
 * All cards have visible dark teal glow for depth and brand consistency
 * Radius reduced by 50% total (25% twice) for tight, refined glow
 * Uniform on all sides (offset 0,0)
 */

const TEAL_GLOW = '#0F81A3'; // ClearScore dark teal

export const shadows = {
  small: {
    shadowColor: TEAL_GLOW,
    shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
    shadowOpacity: 0.25,
    shadowRadius: 7, // 9 * 0.75 = 6.75 -> 7
    elevation: 6,
  },
  medium: {
    shadowColor: TEAL_GLOW,
    shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
    shadowOpacity: 0.3,
    shadowRadius: 9, // 12 * 0.75
    elevation: 8,
  },
  large: {
    shadowColor: TEAL_GLOW,
    shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
    shadowOpacity: 0.35,
    shadowRadius: 11, // 15 * 0.75 = 11.25 -> 11
    elevation: 12,
  },
  glow: {
    shadowColor: TEAL_GLOW,
    shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
    shadowOpacity: 0.4,
    shadowRadius: 14, // 18 * 0.75 = 13.5 -> 14
    elevation: 16,
  },
};

export default shadows;
