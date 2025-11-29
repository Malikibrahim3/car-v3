import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { PALETTE, SPACING } from '@/src/constants/DesignSystem';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmer.value,
      [0, 1],
      [-300, 300]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: PALETTE.border,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

export const SkeletonCard: React.FC = () => (
  <View
    style={{
      backgroundColor: PALETTE.surface,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      shadowColor: '#0F81A3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 11,
      elevation: 12,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
      <SkeletonLoader width={120} height={24} />
      <SkeletonLoader width={80} height={24} />
    </View>
    
    <SkeletonLoader width="60%" height={16} style={{ marginBottom: SPACING.sm }} />
    
    <View style={{ flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg }}>
      <SkeletonLoader width={100} height={40} />
      <SkeletonLoader width={100} height={40} />
    </View>
  </View>
);
