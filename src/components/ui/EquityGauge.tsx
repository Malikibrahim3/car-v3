/**
 * Equity Gauge - Traffic Light / Thermometer Style
 * 
 * Visual metaphor: Red (left) to Green (right)
 * Break-even is the center line
 * 
 * Red Zone: Negative Equity - "Shortfall / Cost to Change"
 * Green Zone: Positive Equity - "Cash for Next Deposit"
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';
import { formatCurrency, getStatusLabel, getActionLabel } from '@/src/utils/equityCalculator';

interface EquityGaugeProps {
  cashPosition: number;        // The main number
  maxRange?: number;           // Max value for gauge scale (default £5000)
  showLabels?: boolean;
  compact?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAUGE_WIDTH = SCREEN_WIDTH - 48;

export const EquityGauge: React.FC<EquityGaugeProps> = ({
  cashPosition,
  maxRange = 5000,
  showLabels = true,
  compact = false
}) => {
  const animatedPosition = useRef(new Animated.Value(0.5)).current;
  
  // Calculate position on gauge (0 = far left/negative, 0.5 = center/zero, 1 = far right/positive)
  const normalizedPosition = Math.max(0, Math.min(1, (cashPosition + maxRange) / (maxRange * 2)));
  
  useEffect(() => {
    Animated.spring(animatedPosition, {
      toValue: normalizedPosition,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
  }, [normalizedPosition]);
  
  const isPositive = cashPosition >= 0;
  const statusLabel = getStatusLabel(cashPosition);
  const actionLabel = getActionLabel(cashPosition);
  
  // Indicator position
  const indicatorLeft = animatedPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, GAUGE_WIDTH - 20]
  });

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactGaugeTrack}>
          <LinearGradient
            colors={['#EF4444', '#FCD34D', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.compactGradient}
          />
          {/* Center line */}
          <View style={styles.compactCenterLine} />
          {/* Indicator */}
          <Animated.View style={[styles.compactIndicator, { left: indicatorLeft }]}>
            <View style={[
              styles.compactIndicatorDot,
              { backgroundColor: isPositive ? PALETTE.success : PALETTE.danger }
            ]} />
          </Animated.View>
        </View>
        <Text style={[
          styles.compactValue,
          { color: isPositive ? PALETTE.success : PALETTE.danger }
        ]}>
          {formatCurrency(cashPosition, true)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Value Display */}
      <View style={styles.valueContainer}>
        <Text style={styles.statusLabel}>{statusLabel}</Text>
        <Text style={[
          styles.mainValue,
          { color: isPositive ? PALETTE.success : PALETTE.danger }
        ]}>
          {formatCurrency(Math.abs(cashPosition))}
        </Text>
        <Text style={[
          styles.actionLabel,
          { color: isPositive ? PALETTE.success : PALETTE.danger }
        ]}>
          {actionLabel}
        </Text>
      </View>

      {/* Gauge Track */}
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeTrack}>
          <LinearGradient
            colors={['#EF4444', '#F97316', '#FCD34D', '#84CC16', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gaugeGradient}
          />
          
          {/* Center line (break-even) */}
          <View style={styles.centerLine}>
            <View style={styles.centerLineInner} />
          </View>
          
          {/* Position Indicator */}
          <Animated.View style={[styles.indicator, { left: indicatorLeft }]}>
            <View style={styles.indicatorLine} />
            <View style={[
              styles.indicatorDot,
              { 
                backgroundColor: isPositive ? PALETTE.success : PALETTE.danger,
                borderColor: isPositive ? '#166534' : '#991B1B'
              }
            ]} />
          </Animated.View>
        </View>

        {/* Labels */}
        {showLabels && (
          <View style={styles.labelsContainer}>
            <Text style={styles.labelLeft}>-£{(maxRange / 1000).toFixed(0)}k</Text>
            <Text style={styles.labelCenter}>£0</Text>
            <Text style={styles.labelRight}>+£{(maxRange / 1000).toFixed(0)}k</Text>
          </View>
        )}
      </View>

      {/* Zone Labels */}
      <View style={styles.zoneLabels}>
        <View style={styles.zoneLeft}>
          <View style={[styles.zoneDot, { backgroundColor: PALETTE.danger }]} />
          <Text style={styles.zoneText}>Shortfall</Text>
        </View>
        <View style={styles.zoneRight}>
          <View style={[styles.zoneDot, { backgroundColor: PALETTE.success }]} />
          <Text style={styles.zoneText}>Available Cash</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  
  // Value Display
  valueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  mainValue: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  
  // Gauge
  gaugeContainer: {
    marginBottom: SPACING.md,
  },
  gaugeTrack: {
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeGradient: {
    flex: 1,
    borderRadius: 12,
  },
  centerLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLineInner: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  
  // Indicator
  indicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    alignItems: 'center',
  },
  indicatorLine: {
    width: 2,
    height: 40,
    backgroundColor: PALETTE.text,
  },
  indicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    marginTop: -8,
  },
  
  // Labels
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  labelLeft: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.danger,
    fontWeight: '600',
  },
  labelCenter: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    fontWeight: '700',
  },
  labelRight: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.success,
    fontWeight: '600',
  },
  
  // Zone Labels
  zoneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  zoneRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneText: {
    fontSize: TYPOGRAPHY.caption1,
    color: PALETTE.textSecondary,
    fontWeight: '500',
  },
  
  // Compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  compactGaugeTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  compactGradient: {
    flex: 1,
    borderRadius: 4,
  },
  compactCenterLine: {
    position: 'absolute',
    left: '50%',
    top: -2,
    bottom: -2,
    width: 2,
    marginLeft: -1,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  compactIndicator: {
    position: 'absolute',
    top: -4,
    width: 16,
  },
  compactIndicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  compactValue: {
    fontSize: TYPOGRAPHY.headline,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    minWidth: 80,
    textAlign: 'right',
  },
});

export default EquityGauge;
