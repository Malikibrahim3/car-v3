import React, { useMemo } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { Canvas, Path, LinearGradient, vec, Skia } from "@shopify/react-native-skia";
import { PALETTE } from '@/constants/DesignSystem';

interface SparklineProps {
  data?: number[];
  height?: number;
  color?: string;
}

export const Sparkline = ({ 
  data = [42000, 43500, 42800, 45000, 44200, 46500, 47000], 
  height = 150, 
  color = PALETTE.accent 
}: SparklineProps) => {
  const [width, setWidth] = React.useState(0);

  // Generate smooth curve path from data
  const path = useMemo(() => {
    if (!width || data.length < 2) return null;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * (height * 0.7) - height * 0.15;
      return { x, y };
    });

    // Create smooth curve using quadratic bezier
    let pathString = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      pathString += ` Q ${controlX} ${current.y}, ${next.x} ${next.y}`;
    }
    
    // Close the path to create filled area
    pathString += ` L ${width} ${height} L 0 ${height} Z`;
    
    return Skia.Path.MakeFromSVGString(pathString);
  }, [data, width, height]);

  if (!path) {
    return <View style={{ height, width: '100%' }} />;
  }

  return (
    <View 
      style={{ height, width: '100%', overflow: 'hidden', borderRadius: 16 }} 
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
    >
      <Canvas style={{ flex: 1 }}>
        {/* Gradient fill */}
        <Path path={path} style="fill">
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, height)}
            colors={[color + '44', color + '00']} // Fade from Color to Transparent
          />
        </Path>
        {/* Stroke line */}
        <Path path={path} style="stroke" strokeWidth={3} color={color} />
      </Canvas>
    </View>
  );
};
