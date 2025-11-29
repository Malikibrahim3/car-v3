import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

interface TrendIndicatorProps {
  change: number;
  percentage: number;
  size?: 'small' | 'medium' | 'large';
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  change,
  percentage,
  size = 'medium',
}) => {
  const isPositive = change >= 0;
  const color = isPositive ? PALETTE.success : PALETTE.danger;
  
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  const fontSize = size === 'small' ? TYPOGRAPHY.caption2 : size === 'medium' ? TYPOGRAPHY.caption1 : TYPOGRAPHY.footnote;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(val));
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${color}15`,
        paddingHorizontal: size === 'small' ? SPACING.xs : SPACING.sm,
        paddingVertical: size === 'small' ? SPACING.xxs : SPACING.xs,
        borderRadius: size === 'small' ? 8 : 12,
        gap: SPACING.xxs,
      }}
    >
      {isPositive ? (
        <TrendingUp size={iconSize} color={color} />
      ) : (
        <TrendingDown size={iconSize} color={color} />
      )}

      <Text
        style={{
          fontFamily: TYPOGRAPHY.fontFamilyText,
          color,
          fontSize,
          fontWeight: TYPOGRAPHY.semibold,
        }}
      >
        {isPositive ? '+' : ''}{formatCurrency(change)}
      </Text>

      <Text
        style={{
          fontFamily: TYPOGRAPHY.fontFamilyText,
          color,
          fontSize,
          fontWeight: TYPOGRAPHY.medium,
        }}
      >
        ({percentage >= 0 ? '+' : ''}{percentage.toFixed(2)}%)
      </Text>
    </View>
  );
};
