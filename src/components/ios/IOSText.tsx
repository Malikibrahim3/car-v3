/**
 * iOS-Compliant Text
 * Enforces proper font weights for headings (600+ for iOS)
 * Works WITH React Native Paper
 */
import React from 'react';
import { Text as PaperText, TextProps } from 'react-native-paper';
import { TextStyle } from 'react-native';

interface IOSTextProps extends TextProps<any> {
  style?: TextStyle | TextStyle[];
}

export const IOSText: React.FC<IOSTextProps> = ({ 
  variant, 
  style, 
  ...props 
}) => {
  const isHeading = variant && (
    variant.includes('headline') || 
    variant.includes('display') || 
    variant.includes('title')
  );
  
  // Apply bold weight to headings for iOS feel
  const iosStyle: TextStyle = isHeading ? { fontWeight: '700' } : {};
  
  return (
    <PaperText
      variant={variant}
      style={[iosStyle, style]}
      {...props}
    />
  );
};
