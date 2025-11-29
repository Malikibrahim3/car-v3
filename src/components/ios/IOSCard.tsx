/**
 * IOSCard - iOS-style card component
 * Replaces react-native-paper Surface/Card
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { IOS_SHADOW, IOS_RADIUS, IOS_PADDING, IOS_COLORS } from './theme';

interface IOSCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevation?: number;
}

export const IOSCard: React.FC<IOSCardProps> = ({ children, style, elevation = 2 }) => {
  // Dark Teal Glow - Visible on all cards - ALWAYS APPLIED - Radius reduced 50% total, uniform on all sides
  const CARD_SHADOW = {
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 0 }, // Uniform on all sides
    shadowOpacity: 0.5,
    shadowRadius: 16, // 22 * 0.75 = 16.5 -> 16
    elevation: 15,
  };

  return (
    // CRITICAL: Shadow container separate from content container
    <View style={[CARD_SHADOW, { borderRadius: IOS_RADIUS }]}>
      <View style={[styles.card, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: IOS_COLORS.secondarySystemBackground, // White cards
    borderRadius: IOS_RADIUS,
    padding: IOS_PADDING,
  },
});
