import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    title: string;
    onPress: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <View style={{ alignItems: 'center', padding: SPACING.xxxl }}>
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: PALETTE.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
      }}
    >
      {icon}
    </View>
    <Text
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: TYPOGRAPHY.h2,
        fontWeight: TYPOGRAPHY.bold,
        color: PALETTE.text,
        marginBottom: SPACING.md,
        textAlign: 'center',
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        fontSize: TYPOGRAPHY.body,
        color: PALETTE.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
      }}
    >
      {description}
    </Text>
    {action && (
      <Button
        title={action.title}
        onPress={action.onPress}
        variant="primary"
      />
    )}
  </View>
);
