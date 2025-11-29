import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { TrendingUp, Award, Target, DollarSign } from 'lucide-react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';

interface MilestoneCardProps {
  type: 'portfolio' | 'equity' | 'appreciation' | 'goal';
  value: number;
  title: string;
  description: string;
  visible?: boolean;
}

const MILESTONE_ICONS = {
  portfolio: DollarSign,
  equity: Target,
  appreciation: TrendingUp,
  goal: Award,
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  type,
  value,
  title,
  description,
  visible = true,
}) => {
  const Icon = MILESTONE_ICONS[type];

  if (!visible) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      exiting={FadeOutUp.duration(300)}
      style={{
        backgroundColor: PALETTE.surface,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 0,
        borderColor: 'transparent',
        shadowColor: '#0F81A3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 11,
        elevation: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${PALETTE.success}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.base,
          }}
        >
          <Icon size={24} color={PALETTE.success} />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.caption1,
              fontWeight: TYPOGRAPHY.semibold,
              color: PALETTE.success,
              letterSpacing: TYPOGRAPHY.wide,
              textTransform: 'uppercase',
              marginBottom: SPACING.xxs,
            }}
          >
            Milestone Reached
          </Text>

          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.title3,
              fontWeight: TYPOGRAPHY.bold,
              color: PALETTE.text,
              marginBottom: SPACING.xs,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamilyText,
              fontSize: TYPOGRAPHY.subheadline,
              color: PALETTE.textSecondary,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>

          {/* Value */}
          <Text
            style={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.title2,
              fontWeight: TYPOGRAPHY.bold,
              color: PALETTE.success,
              marginTop: SPACING.sm,
            }}
          >
            {formatCurrency(value)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
