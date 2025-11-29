import React from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PALETTE, METRICS, triggerHaptic } from '@/constants/DesignSystem';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'white' | 'teal' | 'dark' | 'glow';
}

export const GlassCard = ({
  children,
  style,
  onPress,
  variant = 'white',
}: GlassCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      triggerHaptic();
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  // Dark Teal Glow - Visible on all cards - Radius reduced 25%
  const TEAL_GLOW = '#0F81A3';

  const variantStyles = {
    white: {
      backgroundColor: PALETTE.surface,
      shadowColor: TEAL_GLOW,
      shadowOpacity: 0.35,
      borderColor: 'transparent',
    },
    teal: {
      backgroundColor: PALETTE.surface,
      shadowColor: TEAL_GLOW,
      shadowOpacity: 0.35,
      borderColor: 'transparent',
    },
    dark: {
      backgroundColor: PALETTE.surface,
      shadowColor: TEAL_GLOW,
      shadowOpacity: 0.35,
      borderColor: 'transparent',
    },
    glow: {
      backgroundColor: PALETTE.surface,
      shadowColor: TEAL_GLOW,
      shadowOpacity: 0.4,
      shadowRadius: 18, // 24 * 0.75
      borderColor: 'transparent',
    },
  };

  const currentVariant = variantStyles[variant];
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            borderRadius: METRICS.radius,
            backgroundColor: currentVariant.backgroundColor,
            shadowColor: currentVariant.shadowColor,
            shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
            shadowOpacity: currentVariant.shadowOpacity,
            shadowRadius: variant === 'glow' ? 14 : 11, // 18->14, 15->11
            elevation: variant === 'glow' ? 16 : 12,
            borderWidth: 0,
            borderColor: currentVariant.borderColor,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Wrapper>
  );
};
