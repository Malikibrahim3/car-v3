import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';
import { PALETTE } from '../constants/DesignSystem';
import { ChartErrorBoundary } from './ChartErrorBoundary';

export const CinematicChart = ({
  data,
  height = 150,
}: {
  data: number[];
  height?: number;
}) => {
  // Validate and sanitize data
  const sanitizeData = (rawData: number[] | null | undefined): number[] => {
    // Return fallback if no data
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return [0, 0];
    }

    // Filter out invalid values (null, undefined, NaN, Infinity)
    const validValues = rawData.filter(
      (val) => typeof val === 'number' && isFinite(val)
    );

    // Need at least 2 points for a line chart
    if (validValues.length < 2) {
      // If we have 1 valid point, duplicate it
      if (validValues.length === 1) {
        return [validValues[0], validValues[0]];
      }
      // Otherwise use fallback
      return [0, 0];
    }

    return validValues;
  };

  const validData = sanitizeData(data);
  
  const chartData = validData.map((value, index) => ({
    timestamp: index,
    value,
  }));

  // Don't render if no valid data
  if (!data || data.length === 0) {
    return (
      <View style={{ height, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ opacity: 0.5 }}>
          {/* Empty state - could add text here if needed */}
        </View>
      </View>
    );
  }

  return (
    <ChartErrorBoundary height={height}>
      <View style={{ height, width: '100%' }}>
        <LineChart.Provider data={chartData}>
          <LineChart height={height} width="100%">
            <LineChart.Path color={PALETTE.accent} strokeWidth={3} />
          </LineChart>
        </LineChart.Provider>
      </View>
    </ChartErrorBoundary>
  );
};
