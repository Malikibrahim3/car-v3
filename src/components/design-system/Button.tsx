/**
 * Button Component - 3 Variants
 * Primary, Secondary, Text
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import shadows from '../../theme/shadows';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  children: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function Button({
  variant = 'primary',
  children,
  onPress,
  disabled = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
    >
      <Text
        style={[
          styles.buttonText,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: spacing.buttonHeight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.maroon,
    ...shadows.small,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.base,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.titleSmall,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.label,
  },
  textText: {
    color: colors.maroon,
  },
  disabledText: {
    opacity: 0.5,
  },
});
