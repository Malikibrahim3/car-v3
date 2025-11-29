import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, triggerHaptic } from '@/src/constants/DesignSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style
}) => {
  const variants = {
    primary: {
      bg: PALETTE.accent,
      text: 'white',
      shadow: SHADOWS.md
    },
    secondary: {
      bg: PALETTE.surface,
      text: PALETTE.text,
      shadow: SHADOWS.sm
    },
    ghost: {
      bg: 'transparent',
      text: PALETTE.accent,
      shadow: SHADOWS.none
    },
    danger: {
      bg: PALETTE.danger,
      text: 'white',
      shadow: SHADOWS.md
    }
  };

  const sizes = {
    sm: { 
      paddingH: SPACING.md, 
      paddingV: SPACING.sm, 
      fontSize: TYPOGRAPHY.footnote, 
      minHeight: 36 
    },
    md: { 
      paddingH: SPACING.lg, 
      paddingV: SPACING.md, 
      fontSize: TYPOGRAPHY.body, 
      minHeight: 44 
    },
    lg: { 
      paddingH: SPACING.xl, 
      paddingV: SPACING.lg, 
      fontSize: TYPOGRAPHY.headline, 
      minHeight: 52 
    }
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  const handlePress = () => {
    triggerHaptic();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: variantStyle.bg,
          paddingHorizontal: sizeStyle.paddingH,
          paddingVertical: sizeStyle.paddingV,
          borderRadius: RADIUS.md,
          minHeight: sizeStyle.minHeight,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.xs,
          opacity: pressed ? 0.8 : disabled ? 0.5 : 1,
          ...(variantStyle.shadow !== SHADOWS.none && variantStyle.shadow),
          ...(fullWidth && { width: '100%' }),
          cursor: disabled ? 'not-allowed' : 'pointer',
        } as ViewStyle,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={{
            color: variantStyle.text,
            fontSize: sizeStyle.fontSize,
            fontWeight: TYPOGRAPHY.semibold,
            fontFamily: TYPOGRAPHY.fontFamilyText
          } as TextStyle}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};
