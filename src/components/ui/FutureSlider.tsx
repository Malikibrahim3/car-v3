/**
 * Future Slider - "What If" Time Travel
 * 
 * Allows user to drag a slider to see predicted position in 6, 12, or 18 months
 * Shows: "If you wait 6 months, your equity rises from -£500 to +£1,200"
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, PanResponder, Animated, Dimensions } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';
import { formatCurrency } from '@/src/utils/equityCalculator';
import { MonthlyProjection } from '@/src/types/vehicle';
import * as Haptics from 'expo-haptics';
import { ArrowRight, TrendingUp, TrendingDown, Clock } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FutureSliderProps {
  projections: MonthlyProjection[];
  currentMonth: number;
  saleType: 'trade_in' | 'private';
}

export const FutureSlider: React.FC<FutureSliderProps> = ({
  projections,
  currentMonth,
  saleType
}) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isSliding, setIsSliding] = useState(false);

  // Get current and selected projections
  const currentProjection = projections[currentMonth];
  const selectedProjection = projections[Math.min(selectedMonth, projections.length - 1)];
  
  const currentCash = saleType === 'trade_in' 
    ? currentProjection?.cashPosition.tradeIn || 0
    : currentProjection?.cashPosition.private || 0;
    
  const selectedCash = saleType === 'trade_in'
    ? selectedProjection?.cashPosition.tradeIn || 0
    : selectedProjection?.cashPosition.private || 0;

  const difference = selectedCash - currentCash;
  const monthsAhead = selectedMonth - currentMonth;
  const isImprovement = difference > 0;

  // Quick select buttons
  const quickSelects = [
    { label: 'Now', months: 0 },
    { label: '+6mo', months: 6 },
    { label: '+12mo', months: 12 },
    { label: '+18mo', months: 18 },
  ];

  const handleQuickSelect = useCallback((months: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMonth(Math.min(currentMonth + months, projections.length - 1));
  }, [currentMonth, projections.length]);

  const handleSliderChange = useCallback((value: number) => {
    const newMonth = Math.round(value);
    if (newMonth !== selectedMonth) {
      Haptics.selectionAsync();
      setSelectedMonth(newMonth);
    }
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Clock size={20} color={PALETTE.accent} />
        <Text style={styles.title}>Future Forecast</Text>
      </View>

      {/* Quick Select Buttons */}
      <View style={styles.quickSelectContainer}>
        {quickSelects.map((item) => {
          const targetMonth = currentMonth + item.months;
          const isSelected = selectedMonth === targetMonth;
          const isDisabled = targetMonth >= projections.length;
          
          return (
            <Pressable
              key={item.label}
              onPress={() => !isDisabled && handleQuickSelect(item.months)}
              style={[
                styles.quickSelectButton,
                isSelected && styles.quickSelectButtonActive,
                isDisabled && styles.quickSelectButtonDisabled
              ]}
            >
              <Text style={[
                styles.quickSelectText,
                isSelected && styles.quickSelectTextActive,
                isDisabled && styles.quickSelectTextDisabled
              ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Custom Slider Track */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View 
            style={[
              styles.sliderFill, 
              { width: `${((selectedMonth - currentMonth) / (projections.length - 1 - currentMonth)) * 100}%` }
            ]} 
          />
          {/* Thumb buttons for key positions */}
          <View style={styles.sliderThumbContainer}>
            {quickSelects.map((item, index) => {
              const targetMonth = currentMonth + item.months;
              const position = ((item.months) / (projections.length - 1 - currentMonth)) * 100;
              const isSelected = selectedMonth === targetMonth;
              
              if (targetMonth >= projections.length) return null;
              
              return (
                <Pressable
                  key={item.label}
                  onPress={() => handleQuickSelect(item.months)}
                  style={[
                    styles.sliderThumb,
                    { left: `${Math.min(position, 95)}%` },
                    isSelected && styles.sliderThumbActive
                  ]}
                />
              );
            })}
          </View>
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Now</Text>
          <Text style={styles.sliderLabel}>{selectedProjection?.monthLabel || ''}</Text>
          <Text style={styles.sliderLabel}>End</Text>
        </View>
      </View>

      {/* Comparison Card */}
      <View style={styles.comparisonCard}>
        {/* Current Position */}
        <View style={styles.positionBox}>
          <Text style={styles.positionLabel}>TODAY</Text>
          <Text style={[
            styles.positionValue,
            { color: currentCash >= 0 ? PALETTE.success : PALETTE.danger }
          ]}>
            {formatCurrency(currentCash, true)}
          </Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <ArrowRight size={24} color={PALETTE.textSecondary} />
          {monthsAhead > 0 && (
            <Text style={styles.monthsLabel}>{monthsAhead}mo</Text>
          )}
        </View>

        {/* Future Position */}
        <View style={styles.positionBox}>
          <Text style={styles.positionLabel}>
            {monthsAhead === 0 ? 'TODAY' : selectedProjection?.monthLabel?.toUpperCase() || 'FUTURE'}
          </Text>
          <Text style={[
            styles.positionValue,
            { color: selectedCash >= 0 ? PALETTE.success : PALETTE.danger }
          ]}>
            {formatCurrency(selectedCash, true)}
          </Text>
        </View>
      </View>

      {/* Difference Summary */}
      {monthsAhead > 0 && (
        <View style={[
          styles.summaryCard,
          { backgroundColor: isImprovement ? '#F0FDF4' : '#FEF2F2' }
        ]}>
          <View style={styles.summaryIcon}>
            {isImprovement ? (
              <TrendingUp size={20} color={PALETTE.success} />
            ) : (
              <TrendingDown size={20} color={PALETTE.danger} />
            )}
          </View>
          <View style={styles.summaryContent}>
            <Text style={[
              styles.summaryTitle,
              { color: isImprovement ? '#166534' : '#991B1B' }
            ]}>
              {isImprovement ? 'Position Improves' : 'Position Worsens'}
            </Text>
            <Text style={[
              styles.summaryText,
              { color: isImprovement ? '#15803D' : '#B91C1C' }
            ]}>
              If you wait {monthsAhead} months, your equity {isImprovement ? 'rises' : 'drops'} by{' '}
              <Text style={styles.summaryAmount}>
                {formatCurrency(Math.abs(difference))}
              </Text>
            </Text>
          </View>
        </View>
      )}

      {/* Optimal Timing Hint */}
      {selectedProjection?.isOptimalMonth && (
        <View style={styles.optimalHint}>
          <Text style={styles.optimalHintText}>
            🎯 This is your optimal selling month!
          </Text>
        </View>
      )}

      {selectedProjection?.isContractEnd && (
        <View style={[styles.optimalHint, { backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }]}>
          <Text style={[styles.optimalHintText, { color: '#92400E' }]}>
            ⚠️ Contract ends here - equity may disappear if you wait longer
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.headline,
    fontWeight: '700',
    color: PALETTE.text,
  },
  
  // Quick Select
  quickSelectContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  quickSelectButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: PALETTE.background,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  quickSelectButtonActive: {
    backgroundColor: PALETTE.accent,
  },
  quickSelectButtonDisabled: {
    opacity: 0.4,
  },
  quickSelectText: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  quickSelectTextActive: {
    color: 'white',
  },
  quickSelectTextDisabled: {
    color: PALETTE.textSecondary,
  },
  
  // Slider
  sliderContainer: {
    marginBottom: SPACING.lg,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: PALETTE.border,
    borderRadius: 4,
    position: 'relative',
    marginVertical: SPACING.md,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: PALETTE.accent,
    borderRadius: 4,
  },
  sliderThumbContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -6,
    height: 20,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PALETTE.surface,
    borderWidth: 3,
    borderColor: PALETTE.border,
    marginLeft: -10,
  },
  sliderThumbActive: {
    borderColor: PALETTE.accent,
    backgroundColor: PALETTE.accent,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
    marginTop: SPACING.sm,
  },
  sliderLabel: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    fontWeight: '500',
  },
  
  // Comparison
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  positionBox: {
    flex: 1,
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    letterSpacing: 0.5,
    marginBottom: SPACING.xxs,
  },
  positionValue: {
    fontSize: TYPOGRAPHY.title3,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  arrowContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  monthsLabel: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Summary
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },
  summaryIcon: {
    marginTop: 2,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryText: {
    fontSize: TYPOGRAPHY.caption1,
    lineHeight: 18,
  },
  summaryAmount: {
    fontWeight: '700',
  },
  
  // Hints
  optimalHint: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#DCFCE7',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  optimalHintText: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: '#166534',
    textAlign: 'center',
  },
});

export default FutureSlider;
