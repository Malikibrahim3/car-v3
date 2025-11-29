/**
 * Native Card Component - iOS Wrapper
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { IOSCard } from '../ios';

export default function Card({ children, style, elevation = 2, ...props }) {
  return (
    <IOSCard
      style={[styles.card, style]}
      elevation={elevation}
      {...props}
    >
      {children}
    </IOSCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
});
