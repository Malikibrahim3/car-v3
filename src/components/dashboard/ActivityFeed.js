/**
 * ActivityFeed - Recent changes to vehicles
 * Design System: List Cards with proper hierarchy
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from '../design-system';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

function ActivityItem({ 
  vehicleName, 
  action, 
  timeAgo, 
  detail,
  isPositive,
  onPress,
  testID 
}) {
  return (
    <Card 
      variant="list"
      style={isPositive && styles.itemPositive}
      onPress={onPress}
      testID={testID}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text 
            variant="titleSmall"
            color={colors.label}
            testID={`${testID}-vehicle`}
          >
            {vehicleName}
          </Text>
          <Text 
            variant="captionLarge"
            color={colors.labelTertiary}
            testID={`${testID}-time`}
          >
            {timeAgo}
          </Text>
        </View>
        
        <Text 
          variant="bodyMedium"
          color={colors.labelSecondary}
          testID={`${testID}-action`}
          style={styles.action}
        >
          {action}
        </Text>
        
        <Text 
          variant="bodyLarge"
          color={isPositive ? colors.systemGreen : colors.label}
          testID={`${testID}-detail`}
          style={styles.detail}
        >
          {detail}
        </Text>
      </View>
      
      <Icon 
        name="chevron-forward" 
        size={20} 
        color={colors.labelTertiary} 
      />
    </Card>
  );
}

export default function ActivityFeed({ 
  activities = [],
  onItemPress,
  testID = 'activity-feed'
}) {
  if (activities.length === 0) {
    return (
      <Card variant="standard" style={styles.empty} testID={`${testID}-empty`}>
        <Text variant="bodyMedium" color={colors.labelTertiary}>
          No recent activity
        </Text>
      </Card>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <Text 
        variant="titleMedium"
        color={colors.label}
        testID={`${testID}-title`}
        style={styles.sectionTitle}
      >
        Recent Activity
      </Text>
      
      <View style={styles.feed}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={activity.id || index}
            vehicleName={activity.vehicleName}
            action={activity.action}
            timeAgo={activity.timeAgo}
            detail={activity.detail}
            isPositive={activity.isPositive}
            onPress={() => onItemPress?.(activity)}
            testID={`${testID}-item-${index}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.base,
  },
  feed: {
    gap: spacing.md,
  },
  itemPositive: {
    borderLeftWidth: 3,
    borderLeftColor: colors.systemGreen,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  action: {
    marginBottom: spacing.xs,
  },
  detail: {
    fontWeight: '600',
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
