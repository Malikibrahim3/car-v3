import { Dimensions, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const PALETTE = {
  // ClearScore authentic palette
  background: '#EFF9FC', // Light teal background - 20% lighter
  surface: '#FFFFFF',    // Pure White - for cards/surfaces only
  
  // Typography
  text: '#1A1A1A',       // Near black for primary text
  textSecondary: '#666666', // Medium grey for secondary text
  textTertiary: '#999999',  // Light grey for tertiary text
  
  // Brand Accents - ClearScore Teal
  accent: '#0F81A3',     // ClearScore Teal - primary brand color
  accentDark: '#0A5A75', // Darker teal for pressed states
  accentSoft: '#B8F9E9', // Light blue-teal for backgrounds
  
  // Secondary Brand - Automotive Crimson
  crimson: '#A50010',     // Unique automotive luxury identifier
  crimsonDark: '#7A000C', // Darker crimson
  crimsonSoft: '#F9B8B8', // Light red/pink
  
  // Status
  success: '#7BC96F',    // Soft green for positive
  successSoft: '#CFF9B8', // Light green
  danger: '#E74C3C',     // Red for errors
  
  // Structural
  border: '#D0E8ED',     // Light teal border
  divider: '#E6F7FA',    // Subtle teal divider
  shadow: '#0F81A3',     // Teal shadow
};

export const METRICS = {
  radius: 20, // Slightly tighter radius for light mode
  padding: 20,
  gap: 16,
  screenWidth: width,
};

export const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};
