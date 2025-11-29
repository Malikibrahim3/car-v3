import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

type TimePeriod = '1M' | '3M' | '6M' | '1Y' | 'All';

interface TimePeriodControlProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
  periods?: TimePeriod[];
}

export const TimePeriodControl: React.FC<TimePeriodControlProps> = ({
  selected,
  onChange,
  periods = ['1M', '3M', '6M', '1Y', 'All'],
}) => {
  const indicatorPosition = useSharedValue(0);
  const segmentWidth = 60;

  const handleSelect = (period: TimePeriod, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    indicatorPosition.value = withSpring(index * segmentWidth, {
      damping: 20,
      stiffness: 90,
    });
    onChange(period);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  // Set initial position
  React.useEffect(() => {
    const index = periods.indexOf(selected);
    indicatorPosition.value = index * segmentWidth;
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: PALETTE.surface,
        borderRadius: 12,
        padding: SPACING.xxs,
        position: 'relative',
        shadowColor: '#0F81A3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 0,
        borderColor: 'transparent',
      }}
    >
      {/* Animated indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: SPACING.xxs,
            left: SPACING.xxs,
            width: segmentWidth,
            height: 32,
            backgroundColor: PALETTE.accent,
            borderRadius: 10,
          },
          indicatorStyle,
        ]}
      />

      {/* Segments */}
      {periods.map((period, index) => (
        <Pressable
          key={period}
          onPress={() => handleSelect(period, index)}
          style={{
            width: segmentWidth,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.footnote,
              fontWeight: TYPOGRAPHY.semibold,
              color: selected === period ? 'white' : PALETTE.textSecondary,
            }}
          >
            {period}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
