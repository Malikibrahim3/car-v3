/**
 * Current Status Card - The Main Dashboard Hero
 * 
 * Displays a single, bold number: The Equity Amount
 * User instantly knows: "If I sell my car today, do I get a check, or do I write a check?"
 * 
 * Simplified terminology:
 * - "Settlement Figure" → "Cost to Clear Finance"
 * - "Positive Equity" → "Cash for Next Deposit"
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';
import { formatCurrency, getStatusLabel, getActionLabel } from '@/src/utils/equityCalculator';
import { EquityGauge } from './EquityGauge';
import { TrendingUp, TrendingDown, ArrowRight, Car, Banknote, CreditCard } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface CurrentStatusCardProps {
  vehicleName: string;
  vehicleImage?: string;
  
  // The key numbers
  tradeInValue: number;
  settlementFigure: number;      // "Cost to Clear Finance"
  cashPosition: number;          // tradeInValue - settlementFigure
  
  // Context
  monthsIntoContract: number;
  totalContractMonths: number;
  financeType: 'pcp' | 'hp' | 'cash';
  
  // Actions
  onViewDetails?: () => void;
  onViewForecast?: () => void;
}

export const CurrentStatusCard: React.FC<CurrentStatusCardProps> = ({
  vehicleName,
  vehicleImage,
  tradeInValue,
  settlementFigure,
  cashPosition,
  monthsIntoContract,
  totalContractMonths,
  financeType,
  onViewDetails,
  onViewForecast
}) => {
  const isPositive = cashPosition >= 0;
  const statusLabel = getStatusLabel(cashPosition);
  const actionLabel = getActionLabel(cashPosition);
  const progressPercent = Math.round((monthsIntoContract / totalContractMonths) * 100);

  return (
    <View style={styles.container}>
      {/* Gradient Background for positive, solid for negative */}
      <LinearGradient
        colors={isPositive 
          ? ['#F0FDF4', '#DCFCE7', '#F0FDF4'] 
          : ['#FEF2F2', '#FECACA', '#FEF2F2']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}
      />

      {/* Status Badge */}
      <View style={[
        styles.statusBadge,
        { backgroundColor: isPositive ? '#166534' : '#991B1B' }
      ]}>
        {isPositive ? (
          <TrendingUp size={14} color="white" />
        ) : (
          <TrendingDown size={14} color="white" />
        )}
        <Text style={styles.statusBadgeText}>
          {isPositive ? 'WINNING' : 'SHORTFALL'}
        </Text>
      </View>

      {/* Vehicle Name */}
      <Text style={styles.vehicleName}>{vehicleName}</Text>

      {/* Main Value - THE KEY NUMBER */}
      <View style={styles.mainValueContainer}>
        <Text style={styles.mainValueLabel}>{statusLabel}</Text>
        <Text style={[
          styles.mainValue,
          { color: isPositive ? '#166534' : '#991B1B' }
        ]}>
          {formatCurrency(Math.abs(cashPosition))}
        </Text>
        <Text style={[
          styles.actionLabel,
          { color: isPositive ? '#15803D' : '#B91C1C' }
        ]}>
          {actionLabel}
        </Text>
      </View>

      {/* Mini Gauge */}
      <View style={styles.gaugeContainer}>
        <EquityGauge cashPosition={cashPosition} maxRange={5000} compact />
      </View>

      {/* Breakdown */}
      <View style={styles.breakdownContainer}>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIcon}>
              <Car size={16} color={PALETTE.accent} />
            </View>
            <View>
              <Text style={styles.breakdownLabel}>Trade-In Value</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(tradeInValue)}</Text>
            </View>
          </View>
          
          <View style={styles.breakdownDivider} />
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownIcon}>
              <CreditCard size={16} color={PALETTE.textSecondary} />
            </View>
            <View>
              <Text style={styles.breakdownLabel}>Cost to Clear Finance</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(settlementFigure)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contract Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {financeType.toUpperCase()} Progress
          </Text>
          <Text style={styles.progressValue}>
            Month {monthsIntoContract} of {totalContractMonths}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onViewForecast?.();
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.primaryButtonText}>View Swap Window</Text>
          <ArrowRight size={18} color="white" />
        </Pressable>
        
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onViewDetails?.();
          }}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.secondaryButtonText}>Full Breakdown</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PALETTE.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.5,
  },
  
  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  
  // Vehicle
  vehicleName: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    marginBottom: SPACING.md,
  },
  
  // Main Value
  mainValueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainValueLabel: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  mainValue: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -3,
    fontVariant: ['tabular-nums'],
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  
  // Gauge
  gaugeContainer: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  
  // Breakdown
  breakdownContainer: {
    backgroundColor: PALETTE.background,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  breakdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownLabel: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '700',
    color: PALETTE.text,
  },
  breakdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: PALETTE.border,
    marginHorizontal: SPACING.md,
  },
  
  // Progress
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.caption2,
    fontWeight: '600',
    color: PALETTE.text,
  },
  progressTrack: {
    height: 6,
    backgroundColor: PALETTE.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PALETTE.accent,
    borderRadius: 3,
  },
  
  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: PALETTE.accent,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '700',
    color: 'white',
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.background,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: PALETTE.text,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});

export default CurrentStatusCard;
