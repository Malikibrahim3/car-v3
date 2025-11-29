/**
 * PortfolioHero - Main value display
 * Design System: Hero Card with maroon accent
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from '../design-system';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function PortfolioHero({ 
  totalValue, 
  equity, 
  vehicleCount,
  testID = 'portfolio-hero'
}) {
  return (
    <Card variant="hero" style={styles.card} testID={testID}>
      {/* Hero number - massive, left-aligned */}
      <Text 
        variant="displayLarge" 
        color={colors.label}
        testID={`${testID}-value`}
        style={styles.heroValue}
      >
        {totalValue}
      </Text>
      
      {/* Label - small, subtle */}
      <Text 
        variant="captionLarge"
        color={colors.labelSecondary}
        testID={`${testID}-label`}
        style={styles.label}
      >
        TOTAL PORTFOLIO VALUE
      </Text>
      
      {/* Secondary metrics - stacked, not in a grid */}
      <View style={styles.secondaryMetrics}>
        <Text 
          variant="titleSmall"
          color={colors.label}
          testID={`${testID}-equity`}
        >
          {equity} equity
        </Text>
        <Text 
          variant="bodyMedium"
          color={colors.labelTertiary}
          testID={`${testID}-count`}
        >
          {vehicleCount} {vehicleCount === 1 ? 'vehicle' : 'vehicles'}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  heroValue: {
    marginBottom: spacing.sm,
  },
  label: {
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  secondaryMetrics: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
});
