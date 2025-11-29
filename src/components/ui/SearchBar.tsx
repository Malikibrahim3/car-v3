import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { PALETTE, SPACING, TYPOGRAPHY } from '@/src/constants/DesignSystem';
import { Search } from 'lucide-react-native';

interface SearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search your cars, plates, VINs…',
  ...props
}: SearchBarProps) => {
  return (
    <View
      style={{
        paddingHorizontal: SPACING.base,
        paddingBottom: SPACING.md,
        backgroundColor: PALETTE.background,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: PALETTE.surface,
          borderRadius: 12,
          paddingHorizontal: SPACING.base,
          paddingVertical: SPACING.sm,
          shadowColor: '#0F81A3',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 0,
          borderColor: 'transparent',
        }}
      >
        <Search
          size={18}
          color={PALETTE.textSecondary}
          style={{ marginRight: SPACING.sm }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PALETTE.textSecondary}
          style={{
            flex: 1,
            fontFamily: TYPOGRAPHY.fontFamilyText,
            fontSize: TYPOGRAPHY.body,
            color: PALETTE.text,
            paddingVertical: SPACING.xs,
          }}
          {...props}
        />
      </View>
    </View>
  );
};
