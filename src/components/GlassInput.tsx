import React from 'react';
import { TextInput, TextInputProps, Text, View } from 'react-native';
import { PALETTE, METRICS } from '../constants/DesignSystem';
import { GlassCard } from './GlassCard';

interface GlassInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

export const GlassInput = ({ label, icon, ...props }: GlassInputProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: PALETTE.textSecondary,
          fontSize: 12,
          marginBottom: 8,
          fontWeight: '600',
          paddingLeft: 4,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <GlassCard
        intensity={20}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: 56,
          borderRadius: 16,
        }}
      >
        {icon && <View style={{ marginRight: 12, opacity: 0.7 }}>{icon}</View>}
        <TextInput
          style={{
            flex: 1,
            color: PALETTE.text,
            fontSize: 16,
            fontWeight: '500',
          }}
          placeholderTextColor={PALETTE.textSecondary}
          selectionColor={PALETTE.accent}
          {...props}
        />
      </GlassCard>
    </View>
  );
};
