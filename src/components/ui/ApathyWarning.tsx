/**
 * Apathy Warning - PCP "Lost Money" Comparison
 * 
 * Shows what user loses by just handing keys back vs selling
 * "Hand Keys Back (£0 return)" vs "Sell via App (+£2,000 return)"
 * 
 * Only shown for PCP contracts with positive equity
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY, RADIUS } from '@/src/constants/DesignSystem';
import { formatCurrency } from '@/src/utils/equityCalculator';
import { AlertTriangle, ArrowRight, Banknote, KeyRound } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ApathyWarningProps {
  handBackValue: number;      // Always £0
  sellValue: number;          // What they'd get selling
  lostMoney: number;          // Difference (same as sellValue)
  onLearnMore?: () => void;
}

export const ApathyWarning: React.FC<ApathyWarningProps> = ({
  handBackValue,
  sellValue,
  lostMoney,
  onLearnMore
}) => {
  if (sellValue <= 0) return null;

  return (
    <View style={styles.container}>
      {/* Warning Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={20} color="#B45309" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Don't Leave Money on the Table</Text>
          <Text style={styles.subtitle}>
            Most PCP customers just hand back their keys and walk away with nothing
          </Text>
        </View>
      </View>

      {/* Comparison */}
      <View style={styles.comparisonContainer}>
        {/* Hand Back Option */}
        <View style={styles.optionCard}>
          <View style={styles.optionIconBad}>
            <KeyRound size={24} color={PALETTE.danger} />
          </View>
          <Text style={styles.optionLabel}>Hand Keys Back</Text>
          <Text style={styles.optionValueBad}>£0</Text>
          <Text style={styles.optionSubtext}>Walk away empty</Text>
        </View>

        {/* VS */}
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
          <ArrowRight size={16} color={PALETTE.textSecondary} />
        </View>

        {/* Sell Option */}
        <View style={[styles.optionCard, styles.optionCardHighlight]}>
          <View style={styles.optionIconGood}>
            <Banknote size={24} color={PALETTE.success} />
          </View>
          <Text style={styles.optionLabel}>Sell Your Car</Text>
          <Text style={styles.optionValueGood}>{formatCurrency(sellValue, true)}</Text>
          <Text style={styles.optionSubtext}>Cash in pocket</Text>
        </View>
      </View>

      {/* Lost Money Callout */}
      <View style={styles.lostMoneyCard}>
        <Text style={styles.lostMoneyLabel}>Money you'd lose by doing nothing:</Text>
        <Text style={styles.lostMoneyValue}>{formatCurrency(lostMoney)}</Text>
      </View>

      {/* CTA */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onLearnMore?.();
        }}
        style={({ pressed }) => [
          styles.ctaButton,
          pressed && styles.ctaButtonPressed
        ]}
      >
        <Text style={styles.ctaText}>See How to Claim Your Cash →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.headline,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.caption1,
    color: '#B45309',
    lineHeight: 18,
  },
  
  // Comparison
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  optionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  optionCardHighlight: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  optionIconBad: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  optionIconGood: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    marginBottom: 4,
  },
  optionValueBad: {
    fontSize: TYPOGRAPHY.title2,
    fontWeight: '600',
    color: PALETTE.danger,
  },
  optionValueGood: {
    fontSize: TYPOGRAPHY.title2,
    fontWeight: '600',
    color: PALETTE.success,
  },
  optionSubtext: {
    fontSize: TYPOGRAPHY.caption2,
    color: PALETTE.textSecondary,
    marginTop: 4,
  },
  
  // VS
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  vsText: {
    fontSize: TYPOGRAPHY.caption1,
    fontWeight: '700',
    color: PALETTE.textSecondary,
    marginBottom: 4,
  },
  
  // Lost Money
  lostMoneyCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  lostMoneyLabel: {
    fontSize: TYPOGRAPHY.caption1,
    color: '#991B1B',
    fontWeight: '500',
    flex: 1,
  },
  lostMoneyValue: {
    fontSize: TYPOGRAPHY.title3,
    fontWeight: '600',
    color: PALETTE.danger,
  },
  
  // CTA
  ctaButton: {
    backgroundColor: PALETTE.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaText: {
    fontSize: TYPOGRAPHY.subheadline,
    fontWeight: '700',
    color: 'white',
  },
});

export default ApathyWarning;
