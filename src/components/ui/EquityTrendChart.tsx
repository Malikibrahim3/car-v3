/**
 * Equity Trend Chart - Clean, Teal-themed
 * 
 * Simple line chart with:
 * - Teal line (brand color)
 * - Scrollable month axis
 * - Clean, minimal design
 */

import React, { useRef, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius, haptic } from '@/src/constants/AutoTrackDesign';

interface DataPoint {
  month: number;
  date?: string;
  equity: number;
  status: 'past' | 'projected';
}

interface EquityTrendChartProps {
  data: DataPoint[];
  currentMonthIndex: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  width?: number;
  height?: number;
}

export const EquityTrendChart: React.FC<EquityTrendChartProps> = ({
  data,
  currentMonthIndex,
  selectedIndex,
  onIndexChange,
  width = 300,
  height = 200,
}) => {
  const PADDING = { top: 20, right: 20, bottom: 40, left: 20 };
  const chartWidth = width - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  const { zeroY, chartMin, chartRange } = useMemo(() => {
    const min = Math.min(...data.map((d) => d.equity), 0);
    const max = Math.max(...data.map((d) => d.equity), 0);
    const range = max - min || 1;
    const padding = range * 0.1;
    const cMin = min - padding;
    const cMax = max + padding;
    const cRange = cMax - cMin;
    const zero = chartHeight - ((0 - cMin) / cRange) * chartHeight + PADDING.top;
    return { zeroY: zero, chartMin: cMin, chartRange: cRange };
  }, [data, chartHeight]);

  const getPoint = (dataPoint: DataPoint, index: number) => {
    const x = PADDING.left + (index / (data.length - 1)) * chartWidth;
    const y = PADDING.top + chartHeight - ((dataPoint.equity - chartMin) / chartRange) * chartHeight;
    return { x, y };
  };

  const linePath = useMemo(() => {
    const points = data.map((d, i) => getPoint(d, i));
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, [data, chartMin, chartRange, chartWidth, chartHeight]);

  const areaPath = useMemo(() => {
    if (!linePath) return '';
    const lastPoint = getPoint(data[data.length - 1], data.length - 1);
    const firstPoint = getPoint(data[0], 0);
    return `${linePath} L ${lastPoint.x} ${zeroY} L ${firstPoint.x} ${zeroY} Z`;
  }, [linePath, data, zeroY]);

  const selectedPoint = getPoint(data[selectedIndex], selectedIndex);
  const todayPoint = getPoint(data[currentMonthIndex], currentMonthIndex);

  return (
    <View style={styles.container}>
      {/* Chart */}
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.brand} stopOpacity="0.2" />
            <Stop offset="1" stopColor={Colors.brand} stopOpacity="0" />
          </SvgGradient>
        </Defs>

        {/* Area fill */}
        <Path d={areaPath} fill="url(#areaGradient)" />

        {/* Zero line */}
        <Line
          x1={PADDING.left}
          y1={zeroY}
          x2={width - PADDING.right}
          y2={zeroY}
          stroke={Colors.border}
          strokeWidth={1}
        />

        {/* Main line */}
        <Path d={linePath} stroke={Colors.brand} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Today marker */}
        <Circle cx={todayPoint.x} cy={todayPoint.y} r={5} fill={Colors.brand} />

        {/* Selected indicator line */}
        <Line
          x1={selectedPoint.x}
          y1={PADDING.top}
          x2={selectedPoint.x}
          y2={height - PADDING.bottom}
          stroke={Colors.brand}
          strokeWidth={1}
          strokeOpacity={0.5}
        />

        {/* Selected dot */}
        <Circle cx={selectedPoint.x} cy={selectedPoint.y} r={6} fill="white" stroke={Colors.brand} strokeWidth={2} />
      </Svg>

      {/* Month Selector - Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthsContainer}
        style={styles.monthsScroll}
      >
        {data.map((d, index) => {
          const isSelected = index === selectedIndex;
          const isCurrent = index === currentMonthIndex;
          return (
            <Pressable
              key={index}
              onPress={() => {
                haptic.selection();
                onIndexChange(index);
              }}
              style={[styles.monthButton, isSelected && styles.monthButtonSelected]}
            >
              <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>
                {d.date || `M${d.month}`}
              </Text>
              {isCurrent && <View style={styles.currentDot} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  monthsScroll: {
    marginTop: Spacing.md,
  },
  monthsContainer: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  monthButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
  },
  monthButtonSelected: {
    backgroundColor: Colors.brand,
  },
  monthText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  monthTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  currentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.brand,
    marginTop: 2,
  },
});

export default EquityTrendChart;
