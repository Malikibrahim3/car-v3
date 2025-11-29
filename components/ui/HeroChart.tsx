import React from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, LinearGradient, vec, Skia, Shadow } from "@shopify/react-native-skia";
import { PALETTE } from '@/constants/DesignSystem';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 160;
const CHART_WIDTH = width - 48;

export const HeroChart = () => {
  // A hardcoded "Success Curve" for the dashboard aesthetic
  const path = Skia.Path.Make();
  path.moveTo(0, CHART_HEIGHT);
  path.cubicTo(
    CHART_WIDTH * 0.4, CHART_HEIGHT,
    CHART_WIDTH * 0.4, 20,
    CHART_WIDTH, 20
  );

  // Gradient Path (Closed)
  const gradientPath = path.copy();
  gradientPath.lineTo(CHART_WIDTH, CHART_HEIGHT);
  gradientPath.lineTo(0, CHART_HEIGHT);
  gradientPath.close();

  return (
    <View style={{ height: CHART_HEIGHT, width: '100%', overflow: 'hidden', borderRadius: 24 }}>
      <Canvas style={{ flex: 1 }}>
        {/* 1. Lush Gradient Background */}
        <Path path={gradientPath} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, CHART_HEIGHT)}
            colors={[PALETTE.success + '22', 'transparent']}
          />
        </Path>

        {/* 2. The Hero Line */}
        <Path 
          path={path} 
          style="stroke" 
          strokeWidth={4} 
          color={PALETTE.success} 
          strokeCap="round"
        >
          <Shadow dx={0} dy={4} blur={8} color="rgba(0,0,0,0.1)" />
        </Path>
      </Canvas>
    </View>
  );
};
