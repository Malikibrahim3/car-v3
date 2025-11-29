/**
 * Swap Window Chart - Area Chart showing "Potential Cash" over time
 * 
 * Replaces complex crossing line graphs with a single area chart
 * Highlights the "Green Zone" where user is winning (positive equity)
 * Marks the "Zero Point" (contract end) to show equity disappearing
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';
import { formatCurrency } from '@/src/utils/equityCalculator';
import { MonthlyProjection, SwapWindow } from '@/src/types/vehicle';
import * as Haptics from 'expo-haptics';

interface SwapWindowChartProps {
  projections: MonthlyProjection[];
  swapWindow: SwapWindow;
  currentMonth: number;
  saleType: 'trade_in' | 'private';
  onSaleTypeChange?: (type: 'trade_in' | 'private') => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;

export const SwapWindowChart: React.FC<SwapWindowChartProps> = ({
  projections,
  swapWindow,
  currentMonth,
  saleType,
  onSaleTypeChange
}) => {
  const [selectedPoint, setSelectedPoint] = useState<MonthlyProjection | null>(null);

  // Prepare chart data
  const chartData = useMemo(() => {
    return projections.map((p, index) => {
      const value = saleType === 'trade_in' ? p.cashPosition.tradeIn : p.cashPosition.private;
      const isInGreenZone = value >= 0;
      const isCurrent = index === currentMonth;
      
      return {
        value,
        label: index % 6 === 0 ? p.monthLabel.split(' ')[0] : '', // Show every 6th label
        dataPointText: '',
        showDataPoint: isCurrent || p.isOptimalMonth || p.isBreakEvenMonth,
        dataPointColor: isCurrent ? PALETTE.accent : 
                        p.isOptimalMonth ? PALETTE.success : 
                        p.isBreakEvenMonth ? PALETTE.warning : 'transparent',
        dataPointRadius: isCurrent ? 8 : 6,
        projection: p,
        index
      };
    });
  }, [projections, saleType, currentMonth]);

  // Find key points for annotations
  const currentData = chartData[currentMonth];
  const optimalData = chartData.find(d => d.projection.isOptimalMonth);
  const breakEvenData = chartData.find(d => d.projection.isBreakEvenMonth);
  const contractEndData = chartData.find(d => d.projection.isContractEnd);

  // Custom tooltip
  const renderTooltip = (item: any) => {
    const p = item.projection as MonthlyProjection;
    const value = saleType === 'trade_in' ? p.cashPosition.tradeIn : p.cashPosition.private;
    const isPositive = value >= 0;

    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipMonth}>{p.monthLabel}</Text>
        <Text style={[
          styles.tooltipValue,
          { color: isPositive ? PALETTE.success : PALETTE.danger }
        ]}>
          {formatCurrency(value, true)}
        </Text>
        <Text style={styles.tooltipLabel}>
          {isPositive ? 'Cash Available' : 'Cost to Change'}
        </Text>
        {p.isOptimalMonth && (
          <View style={styles.tooltipBadge}>
            <Text style={styles.tooltipBadgeText}>🎯 Best Time</Text>
          </View>
        )}
        {p.isContractEnd && (
          <View style={[styles.tooltipBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.tooltipBadgeText, { color: '#92400E' }]}>⚠️ Contract End</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Sale Type Toggle */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Swap Window</Text>
          <Text style={styles.subtitle}>
            {swapWindow.isInWindow 
              ? `You're in the green zone! Peak: Month ${swapWindow.peakMonth}`
              : swapWindow.startMonth > currentMonth
                ? `Green zone starts in ${swapWindow.startMonth - currentMonth} months`
                : 'Optimal window has passed'
            }
          </Text>
        </View>
      </View>

      {/* Sale Type Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSaleTypeChange?.('trade_in');
          }}
          style={[
            styles.toggleButton,
            saleType === 'trade_in' && styles.toggleButtonActive
          ]}
        >
          <Text style={[
            styles.toggleText,
            saleType === 'trade_in' && styles.toggleTextActive
          ]}>
            Quick Sale
          </Text>
          <Text style={styles.toggleSubtext}>Trade-In</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSaleTypeChange?.('private');
          }}
          style={[
            styles.toggleButton,
            saleType === 'private' && styles.toggleButtonActive
          ]}
        >
          <Text style={[
            styles.toggleText,
            saleType === 'private' && styles.toggleTextActive
          ]}>
            Max Value
          </Text>
          <Text style={styles.toggleSubtext}>Private Sale</Text>
        </Pressable>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          areaChart
          curved
          isAnimated
          animationDuration={800}
          data={chartData}
          height={200}
          width={CHART_WIDTH}
          spacing={CHART_WIDTH / (chartData.length + 2)}
          initialSpacing={20}
          endSpacing={20}
          
          // Line styling
          color={PALETTE.accent}
          thickness={3}
          
          // Area fill - gradient from line to zero
          startFillColor={PALETTE.success}
          endFillColor={PALETTE.background}
          startOpacity={0.3}
          endOpacity={0.05}
          
          // Zero line (break-even)
          showReferenceLine1
          referenceLine1Position={0}
          referenceLine1Config={{
            color: PALETTE.textSecondary,
            dashWidth: 5,
            dashGap: 5,
            thickness: 2
          }}
          
          // Axes
          hideYAxisText
          hideRules
          xAxisColor="transparent"
          yAxisColor="transparent"
          xAxisLabelTextStyle={styles.axisLabel}
          
          // Data points
          hideDataPoints={false}
          dataPointsColor={PALETTE.accent}
          dataPointsRadius={4}
          
          // Interaction
          pointerConfig={{
            pointerStripHeight: 180,
            pointerStripColor: PALETTE.border,
            pointerStripWidth: 2,
            pointerColor: PALETTE.text,
            radius: 6,
            pointerLabelWidth: 140,
            pointerLabelHeight: 120,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => renderTooltip(items[0]),
          }}
        />
        
        {/* Zero Line Label */}
        <View style={styles.zeroLineLabel}>
          <Text style={styles.zeroLineLabelText}>BREAK EVEN</Text>
        </View>
      </View>

      {/* Key Points Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: PALETTE.accent }]} />
          <Text style={styles.legendText}>Now</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: PALETTE.success }]} />
          <Text style={styles.legendText}>Best Time</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: PALETTE.warning }]} />
          <Text style={styles.legendText}>Break Even</Text>
        </View>
      </View>

      {/* Green Zone Highlight */}
      {swapWindow.startMonth !== -1 && (
        <View style={styles.greenZoneInfo}>
          <View style={styles.greenZoneBadge}>
            <Text style={styles.greenZoneIcon}>🟢</Text>
            <Text style={styles.greenZoneText}>
              Winning Zone: Months {swapWindow.startMonth} - {swapWindow.endMonth}
            </Text>
          </View>
          <Text style={styles.greenZoneSubtext}>
            Peak equity of {formatCurrency(swapWindow.peakEquity)} at month {swapWindow.peakMonth}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PALETTE.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    // Simplified - no heavy glow
  },
  
  // Header
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.headline,
    fontWeight: '700',
    color: PALETTE.text,
    marginBottom: SPACING.xxs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption1,
    color: PALETTE.textSecondary,
  },
  
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: PALETTE.background,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: PALETTE.surface,
    // Simplified - no colored shadow
  },
  toggleText: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  toggleTextActive: {
    color: PALETTE.text,
  },
  toggleSubtext: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    marginTop: 2,
  },
  
  // Chart
  chartContainer: {
    marginLeft: -10,
    position: 'relative',
  },
  axisLabel: {
    color: PALETTE.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  zeroLineLabel: {
    position: 'absolute',
    left: 8,
    top: 100, // Approximate middle
    backgroundColor: PALETTE.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  zeroLineLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.textSecondary,
    letterSpacing: 0.5,
  },
  
  // Tooltip
  tooltip: {
    backgroundColor: PALETTE.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  tooltipMonth: {
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: TYPOGRAPHY.title3,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  tooltipLabel: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    marginTop: 2,
  },
  tooltipBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  tooltipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  
  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: TYPOGRAPHY.caption1,
    color: PALETTE.textSecondary,
    fontWeight: '500',
  },
  
  // Green Zone Info
  greenZoneInfo: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  greenZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  greenZoneIcon: {
    fontSize: 14,
  },
  greenZoneText: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    color: '#166534',
  },
  greenZoneSubtext: {
    fontSize: TYPOGRAPHY.caption1,
    color: '#15803D',
    marginTop: 4,
    marginLeft: 22,
  },
});

export default SwapWindowChart;
