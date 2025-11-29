import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'neutral',
  size = 'md',
  style 
}) => {
  const variants = {
    success: { 
      bg: '#DCFCE7', 
      text: '#166534' 
    },
    warning: { 
      bg: '#FEF3C7', 
      text: '#92400E' 
    },
    error: { 
      bg: '#FEE2E2', 
      text: '#DC2626' 
    },
    info: { 
      bg: '#B8F9E9', 
      text: '#0F81A3' 
    },
    neutral: {
      bg: '#E6F7FA',
      text: '#1A1A1A'
    }
  };

  const sizes = {
    sm: {
      paddingH: SPACING.xs,
      paddingV: 2,
      fontSize: TYPOGRAPHY.caption2
    },
    md: {
      paddingH: SPACING.sm,
      paddingV: SPACING.xxs,
      fontSize: TYPOGRAPHY.caption1
    }
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <View style={[{
      paddingHorizontal: sizeStyle.paddingH,
      paddingVertical: sizeStyle.paddingV,
      backgroundColor: variantStyle.bg,
      borderRadius: RADIUS.full,
      alignSelf: 'flex-start'
    } as ViewStyle, style]}>
      <Text style={{
        fontSize: sizeStyle.fontSize,
        fontWeight: TYPOGRAPHY.bold,
        color: variantStyle.text,
        letterSpacing: 0.5,
        fontFamily: TYPOGRAPHY.fontFamilyText
      } as TextStyle}>
        {text}
      </Text>
    </View>
  );
};
