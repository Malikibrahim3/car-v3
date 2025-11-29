import React from 'react';
import { View, Text, Image, ViewStyle, ImageSourcePropType, Pressable } from 'react-native';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { PALETTE, SPACING, TYPOGRAPHY, METRICS } from '@/src/constants/DesignSystem';

interface UnifiedCardProps {
  // Visual
  image?: string;
  imageHeight?: number;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
  
  // Content
  title: string;
  subtitle?: string;
  value?: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  
  // Data rows
  stats?: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
  
  // Progress bar
  progress?: {
    percentage: number;
    label: string;
    color?: string;
  };
  
  // Action
  action?: {
    title: string;
    onPress: () => void;
  };
  
  // Styling
  style?: ViewStyle;
  onPress?: () => void;
  testID?: string;
}

export const UnifiedCard = ({
  image,
  imageHeight = 150,
  icon,
  chart,
  title,
  subtitle,
  value,
  trend,
  stats,
  progress,
  action,
  style,
  onPress,
  testID,
}: UnifiedCardProps) => {
  const CardWrapper = onPress ? Pressable : View;
  
  return (
    <CardWrapper onPress={onPress} testID={testID}>
      <GlassCard 
        style={[{ padding: 0, marginBottom: SPACING.lg }, style]}
      >
        <View style={{ overflow: 'hidden', borderRadius: METRICS.radius.lg }}>
          {/* Image Header (if provided) */}
          {image && (
            <View style={{ height: imageHeight, width: '100%', backgroundColor: '#E5E7EB' }}>
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Content Body */}
          <View style={{ padding: SPACING.lg }}>
          {/* Icon + Title Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
            {icon && <View style={{ marginRight: SPACING.md }}>{icon}</View>}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: TYPOGRAPHY.h3,
                  fontWeight: TYPOGRAPHY.extrabold,
                  color: PALETTE.text,
                  letterSpacing: TYPOGRAPHY.tight,
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: TYPOGRAPHY.small,
                    color: PALETTE.textSecondary,
                    marginTop: 2,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            {value && (
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  fontSize: TYPOGRAPHY.h3,
                  fontWeight: TYPOGRAPHY.bold,
                  color: PALETTE.text,
                }}
              >
                {value}
              </Text>
            )}
          </View>

          {/* Chart (if provided) */}
          {chart && (
            <View style={{ marginBottom: SPACING.md, marginHorizontal: -SPACING.lg }}>
              {chart}
            </View>
          )}

          {/* Trend (if provided) */}
          {trend && (
            <View
              style={{
                backgroundColor: trend.isPositive
                  ? 'rgba(5, 150, 105, 0.1)'
                  : 'rgba(220, 38, 38, 0.1)',
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.xs,
                borderRadius: METRICS.radius.sm,
                alignSelf: 'flex-start',
                marginBottom: SPACING.md,
              }}
            >
              <Text
                style={{
                  fontFamily: TYPOGRAPHY.fontFamily,
                  color: trend.isPositive ? PALETTE.success : PALETTE.danger,
                  fontSize: TYPOGRAPHY.small,
                  fontWeight: TYPOGRAPHY.bold,
                }}
              >
                {trend.value}
              </Text>
            </View>
          )}

          {/* Stats Grid (if provided) */}
          {stats && stats.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: SPACING.lg,
                marginBottom: SPACING.md,
                paddingTop: SPACING.md,
                borderTopWidth: 1,
                borderTopColor: PALETTE.border,
              }}
            >
              {stats.map((stat, index) => (
                <View key={index} style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: TYPOGRAPHY.caption,
                      color: PALETTE.textSecondary,
                      textTransform: 'uppercase',
                      letterSpacing: TYPOGRAPHY.wide,
                      marginBottom: SPACING.xs,
                    }}
                  >
                    {stat.label}
                  </Text>
                  <Text
                    style={{
                      fontFamily: TYPOGRAPHY.fontFamily,
                      fontSize: TYPOGRAPHY.body,
                      fontWeight: TYPOGRAPHY.bold,
                      color: stat.color || PALETTE.text,
                    }}
                  >
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Progress Bar (if provided) */}
          {progress && (
            <View style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs }}>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: TYPOGRAPHY.caption,
                    color: PALETTE.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: TYPOGRAPHY.wide,
                  }}
                >
                  {progress.label}
                </Text>
                <Text
                  style={{
                    fontFamily: TYPOGRAPHY.fontFamily,
                    fontSize: TYPOGRAPHY.caption,
                    fontWeight: TYPOGRAPHY.bold,
                    color: progress.color || PALETTE.success,
                  }}
                >
                  {progress.percentage}%
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 3,
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${progress.percentage}%`,
                    backgroundColor: progress.color || PALETTE.text,
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          )}

          {/* Action Button (if provided) */}
          {action && (
            <Button
              title={action.title}
              onPress={action.onPress}
              variant="primary"
              size="medium"
            />
          )}
          </View>
        </View>
      </GlassCard>
    </CardWrapper>
  );
};
