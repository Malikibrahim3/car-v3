import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Sparkline } from './Sparkline';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InteractiveChartProps {
  data: number[];
  height?: number;
  color?: string;
  onDataPointSelect?: (value: number, index: number) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  height = 160,
  color = PALETTE.success,
  onDataPointSelect,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<{ value: number; index: number } | null>(null);
  const tooltipX = useSharedValue(0);
  const tooltipOpacity = useSharedValue(0);

  const chartWidth = SCREEN_WIDTH - SPACING.base * 2 - SPACING.lg * 2;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const findClosestDataPoint = (x: number) => {
    const index = Math.max(0, Math.min(data.length - 1, Math.round((x / chartWidth) * (data.length - 1))));
    return { value: data[index], index };
  };

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const point = findClosestDataPoint(event.x);
      tooltipX.value = event.x;
      tooltipOpacity.value = withSpring(1);
      runOnJS(setSelectedPoint)(point);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      if (onDataPointSelect) {
        runOnJS(onDataPointSelect)(point.value, point.index);
      }
    })
    .onUpdate((event) => {
      const point = findClosestDataPoint(event.x);
      tooltipX.value = event.x;
      runOnJS(setSelectedPoint)(point);
      runOnJS(Haptics.selectionAsync)();
      if (onDataPointSelect) {
        runOnJS(onDataPointSelect)(point.value, point.index);
      }
    })
    .onEnd(() => {
      tooltipOpacity.value = withSpring(0);
      runOnJS(setSelectedPoint)(null);
    });

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [
      { translateX: tooltipX.value - 60 }, // Center tooltip (120px width / 2)
    ],
  }));

  return (
    <GestureHandlerRootView style={{ position: 'relative', height }}>
      {/* Chart */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{ flex: 1 }}>
          <Sparkline data={data} height={height} color={color} />
        </Animated.View>
      </GestureDetector>

      {/* Tooltip */}
      {selectedPoint && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -50,
              width: 120,
              backgroundColor: PALETTE.text,
              borderRadius: 8,
              padding: SPACING.sm,
              alignItems: 'center',
              shadowColor: '#0F81A3',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            },
            tooltipStyle,
          ]}
        >
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              color: 'white',
              fontSize: TYPOGRAPHY.caption1,
              fontWeight: TYPOGRAPHY.bold,
            }}
          >
            {formatCurrency(selectedPoint.value)}
          </Text>
          {/* Triangle pointer */}
          <View
            style={{
              position: 'absolute',
              bottom: -6,
              width: 0,
              height: 0,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: PALETTE.text,
            }}
          />
        </Animated.View>
      )}
    </GestureHandlerRootView>
  );
};
