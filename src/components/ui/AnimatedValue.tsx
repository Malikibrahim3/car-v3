import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TYPOGRAPHY } from '@/src/constants/Typography';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedValueProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  style?: TextStyle;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  prefix = '$',
  suffix = '',
  duration = 1000,
  decimals = 0,
  style,
}) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const formattedValue = animatedValue.value.toFixed(decimals);
    const numberWithCommas = parseFloat(formattedValue).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return {
      text: `${prefix}${numberWithCommas}${suffix}`,
    } as any;
  });

  return (
    <AnimatedText
      animatedProps={animatedProps}
      style={[
        {
          fontFamily: TYPOGRAPHY.fontFamily,
          fontWeight: TYPOGRAPHY.bold,
        },
        style,
      ]}
    />
  );
};
