/**
 * Global Top Bar - Apple iOS Style
 * 
 * Simple navigation bar with profile access
 * Used on screens that don't have large titles
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Plus } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, haptic } from '@/src/constants/AutoTrackDesign';

interface GlobalTopBarProps {
  title?: string;
  showSearch?: boolean;
}

export const GlobalTopBar: React.FC<GlobalTopBarProps> = ({ 
  title,
  showSearch = false 
}) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}
      
      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            haptic.light();
            router.push('/(tabs)/profile');
          }}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <User size={20} color={Colors.label} strokeWidth={1.5} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.systemGroupedBackground,
  },
  title: {
    ...Typography.headline,
    color: Colors.label,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondarySystemGroupedBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: Colors.systemGray5,
  },
});
