import React from 'react';
import { View, ActivityIndicator, Text, ViewStyle } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  style
}) => {
  return (
    <View style={[{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl
    }, style]}>
      <ActivityIndicator size={size} color={PALETTE.accent} />
      {message && (
        <Text style={{
          marginTop: SPACING.md,
          fontSize: TYPOGRAPHY.subheadline,
          color: PALETTE.textSecondary,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.fontFamilyText
        }}>
          {message}
        </Text>
      )}
    </View>
  );
};

// Skeleton Loader for cards
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[{
      backgroundColor: PALETTE.surface,
      borderRadius: 16,
      padding: SPACING.lg,
      marginBottom: SPACING.md
    }, style]}>
      {/* Title skeleton */}
      <View style={{
        height: 20,
        backgroundColor: PALETTE.border,
        borderRadius: 4,
        marginBottom: SPACING.sm,
        width: '60%'
      }} />
      
      {/* Line 1 skeleton */}
      <View style={{
        height: 16,
        backgroundColor: PALETTE.border,
        borderRadius: 4,
        marginBottom: SPACING.xs,
        width: '100%'
      }} />
      
      {/* Line 2 skeleton */}
      <View style={{
        height: 16,
        backgroundColor: PALETTE.border,
        borderRadius: 4,
        width: '80%'
      }} />
    </View>
  );
};

// Skeleton for list items
export const SkeletonListItem: React.FC = () => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.base,
      backgroundColor: PALETTE.surface,
      borderRadius: 12,
      marginBottom: SPACING.sm
    }}>
      {/* Avatar skeleton */}
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: PALETTE.border,
        marginRight: SPACING.md
      }} />
      
      {/* Content skeleton */}
      <View style={{ flex: 1 }}>
        <View style={{
          height: 16,
          backgroundColor: PALETTE.border,
          borderRadius: 4,
          marginBottom: SPACING.xs,
          width: '70%'
        }} />
        <View style={{
          height: 14,
          backgroundColor: PALETTE.border,
          borderRadius: 4,
          width: '50%'
        }} />
      </View>
      
      {/* Value skeleton */}
      <View style={{
        height: 20,
        width: 60,
        backgroundColor: PALETTE.border,
        borderRadius: 4
      }} />
    </View>
  );
};
