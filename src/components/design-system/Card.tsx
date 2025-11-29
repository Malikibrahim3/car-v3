/**
 * Card Component - 4 Variants
 * Standard, Hero, List, Stat
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import shadows from '../../theme/shadows';

interface CardProps {
  variant?: 'standard' | 'hero' | 'list' | 'stat';
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
  onPress?: () => void;
  accentColor?: string;
}

export default function Card({ 
  variant = 'standard', 
  children, 
  style, 
  testID,
  onPress,
  accentColor = colors.maroon,
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    variant === 'hero' && { borderLeftColor: accentColor },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
  },
  standard: {
    borderRadius: 16,
    padding: spacing.cardPadding,
    ...shadows.medium,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  hero: {
    borderRadius: 24,
    padding: spacing.cardPaddingLarge,
    ...shadows.large,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },
  list: {
    borderRadius: 12,
    padding: spacing.cardPadding,
    ...shadows.medium,
    minHeight: spacing.touchTargetMin,
  },
  stat: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: spacing.cardPadding,
    ...shadows.small,
    borderWidth: 0,
    borderColor: 'transparent',
  },
});
