import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';
import { AnimatedValue } from './AnimatedValue';

interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  apiCalibratedValue?: number;
  purchasePrice?: number;
}

interface ComparisonCardProps {
  car1: Car;
  car2: Car;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ car1, car2 }) => {
  const value1 = car1.apiCalibratedValue || car1.purchasePrice || 0;
  const value2 = car2.apiCalibratedValue || car2.purchasePrice || 0;
  const difference = value1 - value2;
  const percentDiff = ((difference / value2) * 100);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <View
      style={{
        backgroundColor: PALETTE.surface,
        borderRadius: 16,
        padding: SPACING.lg,
        shadowColor: '#0F81A3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 11,
        elevation: 12,
        borderWidth: 0,
        borderColor: 'transparent',
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontFamily: TYPOGRAPHY.fontFamilyText,
          fontSize: TYPOGRAPHY.caption1,
          fontWeight: TYPOGRAPHY.semibold,
          color: PALETTE.textSecondary,
          letterSpacing: TYPOGRAPHY.wide,
          textTransform: 'uppercase',
          marginBottom: SPACING.base,
        }}
      >
        Comparison
      </Text>

      {/* Cars */}
      <View style={{ flexDirection: 'row', gap: SPACING.base }}>
        {/* Car 1 */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.headline,
              fontWeight: TYPOGRAPHY.semibold,
              color: PALETTE.text,
              marginBottom: SPACING.xs,
            }}
          >
            {car1.year} {car1.make}
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.subheadline,
              color: PALETTE.textSecondary,
              marginBottom: SPACING.sm,
            }}
          >
            {car1.model}
          </Text>
          <AnimatedValue
            value={value1}
            duration={1000}
            style={{
              color: PALETTE.text,
              fontSize: TYPOGRAPHY.title3,
              fontWeight: TYPOGRAPHY.bold,
            }}
          />
        </View>

        {/* Divider */}
        <View
          style={{
            width: 1,
            backgroundColor: PALETTE.border,
            marginHorizontal: SPACING.sm,
          }}
        />

        {/* Car 2 */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.headline,
              fontWeight: TYPOGRAPHY.semibold,
              color: PALETTE.text,
              marginBottom: SPACING.xs,
            }}
          >
            {car2.year} {car2.make}
          </Text>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.subheadline,
              color: PALETTE.textSecondary,
              marginBottom: SPACING.sm,
            }}
          >
            {car2.model}
          </Text>
          <AnimatedValue
            value={value2}
            duration={1000}
            style={{
              color: PALETTE.text,
              fontSize: TYPOGRAPHY.title3,
              fontWeight: TYPOGRAPHY.bold,
            }}
          />
        </View>
      </View>

      {/* Difference */}
      <View
        style={{
          marginTop: SPACING.lg,
          paddingTop: SPACING.base,
          borderTopWidth: 1,
          borderTopColor: PALETTE.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {difference >= 0 ? (
          <TrendingUp size={18} color={PALETTE.success} style={{ marginRight: SPACING.xs }} />
        ) : (
          <TrendingDown size={18} color={PALETTE.danger} style={{ marginRight: SPACING.xs }} />
        )}
        <Text
          style={{
            fontFamily: TYPOGRAPHY.fontFamilyText,
            fontSize: TYPOGRAPHY.subheadline,
            color: PALETTE.textSecondary,
            marginRight: SPACING.xs,
          }}
        >
          Difference:
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.headline,
            fontWeight: TYPOGRAPHY.bold,
            color: difference >= 0 ? PALETTE.success : PALETTE.danger,
          }}
        >
          {difference >= 0 ? '+' : ''}{formatCurrency(Math.abs(difference))}
        </Text>
        <Text
          style={{
            fontFamily: TYPOGRAPHY.fontFamilyText,
            fontSize: TYPOGRAPHY.subheadline,
            color: difference >= 0 ? PALETTE.success : PALETTE.danger,
            marginLeft: SPACING.xs,
          }}
        >
          ({percentDiff >= 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
        </Text>
      </View>
    </View>
  );
};
