/**
 * QuickMetrics - Quick stat cards
 * Design System: Stat Cards side-by-side
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from '../design-system';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

function MetricCard({ value, label, testID }) {
  return (
    <Card variant="stat" style={styles.card} testID={testID}>
      <Text 
        variant="titleLarge"
        color={colors.label}
        testID={`${testID}-value`}
        style={styles.value}
      >
        {value}
      </Text>
      <Text 
        variant="captionLarge"
        color={colors.labelSecondary}
        testID={`${testID}-label`}
        style={styles.label}
      >
        {label}
      </Text>
    </Card>
  );
}

export default function QuickMetrics({ 
  mileage, 
  monthlyCost,
  testID = 'quick-metrics'
}) {
  return (
    <View style={styles.container} testID={testID}>
      <MetricCard 
        value={mileage}
        label="miles"
        testID={`${testID}-mileage`}
      />
      <MetricCard 
        value={monthlyCost}
        label="avg monthly"
        testID={`${testID}-cost`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
  },
  value: {
    marginBottom: spacing.sm,
  },
  label: {
    textTransform: 'lowercase',
  },
});
