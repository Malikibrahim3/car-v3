/**
 * Stat Card Component - Shows key metrics
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IOSText as Text } from '../ios';
import Card from './Card';

export default function StatCard({ label, value, icon: Icon, color, trend }) {
  const theme = useTheme();
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        {Icon && (
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon size={24} color={color || theme.colors.primary} />
          </View>
        )}
        <Text variant="labelMedium" style={styles.label}>
          {label}
        </Text>
      </View>
      
      <Text variant="headlineMedium" style={styles.value}>
        {value}
      </Text>
      
      {trend && (
        <Text
          variant="bodySmall"
          style={[
            styles.trend,
            { color: trend.isPositive ? theme.colors.success : theme.colors.error }
          ]}
        >
          {trend.text}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trend: {
    fontWeight: '600',
  },
});
