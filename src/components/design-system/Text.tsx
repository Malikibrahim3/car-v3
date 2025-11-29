/**
 * Text Component - Typography Wrapper
 * Ensures consistent typography usage
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import typography from '../../theme/typography';
import colors from '../../theme/colors';

type TypographyVariant = 
  | 'displayLarge'
  | 'displayMedium'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'captionLarge'
  | 'captionSmall';

interface TextProps {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
  testID?: string;
  numberOfLines?: number;
}

export default function Text({
  variant = 'bodyLarge',
  color = colors.label,
  children,
  style,
  testID,
  numberOfLines,
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color },
        style,
      ]}
      testID={testID}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
