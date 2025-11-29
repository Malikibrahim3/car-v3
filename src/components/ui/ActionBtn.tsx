import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, ViewStyle } from 'react-native';
import { PALETTE, TYPOGRAPHY, triggerHaptic } from '@/src/constants/DesignSystem';

interface ActionBtnProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ActionBtn = ({ title, onPress, style }: ActionBtnProps) => (
  <Pressable 
    onPress={() => { 
      triggerHaptic(); 
      onPress?.(); 
    }}
  >
    <LinearGradient
      colors={[PALETTE.text, PALETTE.textSecondary]} // Navy to Grey Gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: 'center',
          shadowColor: '#0F81A3',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 11,
          elevation: 12,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: TYPOGRAPHY.fontFamily, color: 'white', fontWeight: TYPOGRAPHY.bold, fontSize: TYPOGRAPHY.body, letterSpacing: TYPOGRAPHY.wide }}>
        {title}
      </Text>
    </LinearGradient>
  </Pressable>
);
