import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  current,
  target,
  size = 120,
  strokeWidth = 8,
  color = PALETTE.success,
  label = 'Progress',
  showPercentage = true,
}) => {
  const progress = useSharedValue(0);
  const percentage = Math.min((current / target) * 100, 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (progress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={PALETTE.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress ring */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedProps}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        
        {/* Center label */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showPercentage ? (
            <Text
              style={{
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: TYPOGRAPHY.title2,
                fontWeight: TYPOGRAPHY.bold,
                color: PALETTE.text,
              }}
            >
              {percentage.toFixed(0)}%
            </Text>
          ) : (
            <>
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: TYPOGRAPHY.headline,
                  fontWeight: TYPOGRAPHY.bold,
                  color: PALETTE.text,
                }}
              >
                {formatCurrency(current)}
              </Text>
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fontFamilyText,
                  fontSize: TYPOGRAPHY.caption2,
                  color: PALETTE.textSecondary,
                  marginTop: SPACING.xxs,
                }}
              >
                of {formatCurrency(target)}
              </Text>
            </>
          )}
        </View>
      </View>
      
      {/* Label */}
      <Text
        style={{
          fontFamily: TYPOGRAPHY.fontFamilyText,
          fontSize: TYPOGRAPHY.subheadline,
          color: PALETTE.textSecondary,
          marginTop: SPACING.sm,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </View>
  );
};
