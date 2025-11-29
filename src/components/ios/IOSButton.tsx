/**
 * iOS-Compliant Button
 * Enforces 44pt minimum height (iOS HIG)
 * Applies maroon theme for primary actions
 * Works WITH React Native Paper, not against it
 */
import React from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface IOSButtonProps extends Omit<ButtonProps, 'compact'> {
  compact?: boolean; // Ignored - always enforces minimum height
}

export const IOSButton: React.FC<IOSButtonProps> = ({ 
  contentStyle,
  compact, // Ignored
  mode = 'contained',
  style,
  buttonColor,
  textColor,
  ...props 
}) => {
  // ClearScore Teal for primary actions
  const finalButtonColor = mode === 'contained' && !buttonColor ? '#0F81A3' : buttonColor;
  const finalTextColor = mode === 'contained' && !textColor ? '#FFFFFF' : textColor;
  
  return (
    <PaperButton
      mode={mode}
      buttonColor={finalButtonColor}
      textColor={finalTextColor}
      contentStyle={[styles.content, contentStyle]}
      style={[styles.button, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  content: {
    height: 48,  // Slightly taller than minimum for better appearance
    paddingVertical: 8,
  },
});
