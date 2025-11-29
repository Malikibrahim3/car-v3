import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Canvas, Path, LinearGradient, vec, Skia, Circle } from "@shopify/react-native-skia";
import { PALETTE } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');

export const HeroChart = ({ data = [10, 40, 20, 50, 30, 60, 80] }) => {
  const chartHeight = 180;
  const chartWidth = width - 48; // Padding adjustments

  // 1. Create a smooth Bezier Curve (Hardcoded for visual impact now, dynamic later)
  const path = Skia.Path.Make();
  path.moveTo(0, chartHeight);
  // This draws a nice "S" curve representing growth
  path.cubicTo(chartWidth * 0.3, chartHeight, chartWidth * 0.3, 0, chartWidth, 0);
  path.lineTo(chartWidth, chartHeight); // Close the path for gradient fill
  path.lineTo(0, chartHeight);
  path.close();

  // 2. The Stroke Path (The Line on top)
  const linePath = Skia.Path.Make();
  linePath.moveTo(0, chartHeight);
  linePath.cubicTo(chartWidth * 0.3, chartHeight, chartWidth * 0.3, 0, chartWidth, 0);

  return (
    <View style={{ height: 240, width: '100%', marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 }}>
        <Text style={{ color: PALETTE.textSecondary, fontWeight: '700', letterSpacing: 1, fontSize: 11 }}>
          PORTFOLIO TREND
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: PALETTE.success, fontWeight: '700', fontSize: 12 }}>+12.4% </Text>
          <Text style={{ color: PALETTE.textSecondary, fontSize: 12, fontWeight: '600' }}> (This Year)</Text>
        </View>
      </View>

      <View style={{ height: chartHeight, width: '100%' }}>
        <Canvas style={{ flex: 1 }}>
          {/* 1. The Gradient Fill (Gives it volume) */}
          <Path path={path} style="fill">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, chartHeight)}
              colors={[PALETTE.success + '33', 'transparent']} // Green fading to transparent
            />
          </Path>

          {/* 2. The Line (Gives it definition) */}
          <Path
            path={linePath}
            style="stroke"
            strokeWidth={4}
            color={PALETTE.success}
            strokeCap="round"
          />

          {/* 3. The "Pulse" Dot at the end */}
          <Circle cx={chartWidth} cy={0} r={6} color={PALETTE.success} />
          <Circle cx={chartWidth} cy={0} r={12} color={PALETTE.success} opacity={0.2} />
        </Canvas>
      </View>

      {/* 4. Timeframe Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 8 }}>
        {['1M', '3M', '6M', '1Y', 'ALL'].map((t, i) => (
          <Text
            key={t}
            style={{
              color: i === 3 ? PALETTE.text : PALETTE.textSecondary,
              fontWeight: i === 3 ? '800' : '600',
              fontSize: 12,
              opacity: i === 3 ? 1 : 0.6
            }}
          >
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
};
