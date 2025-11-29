import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTE, SPACING, TYPOGRAPHY, triggerHaptic } from '@/src/constants/DesignSystem';
import { Search, Bell, User } from 'lucide-react-native';

interface GlobalHeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export const GlobalHeader = ({
  title = 'AutoTrack',
  showSearch = true,
  showNotifications = true,
  showProfile = true,
  onSearchPress,
  onNotificationsPress,
  onProfilePress,
}: GlobalHeaderProps) => {
  const router = useRouter();

  const handleSearchPress = () => {
    triggerHaptic();
    onSearchPress?.();
  };

  const handleNotificationsPress = () => {
    triggerHaptic();
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      router.push('/(tabs)/activity');
    }
  };

  const handleProfilePress = () => {
    triggerHaptic();
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.base,
        paddingVertical: SPACING.sm,
        backgroundColor: PALETTE.background,
      }}
    >
      {/* App Name/Title */}
      <Text
        style={{
          fontFamily: TYPOGRAPHY.fontFamily,
          fontSize: TYPOGRAPHY.title2,
          fontWeight: TYPOGRAPHY.bold,
          color: PALETTE.text,
          letterSpacing: TYPOGRAPHY.tight,
        }}
      >
        {title}
      </Text>

      {/* Utility Icons */}
      <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
        {showSearch && (
          <Pressable
            onPress={handleSearchPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: PALETTE.surface,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0F81A3',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Search size={20} color={PALETTE.text} />
          </Pressable>
        )}

        {showNotifications && (
          <Pressable
            onPress={handleNotificationsPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: PALETTE.surface,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0F81A3',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Bell size={20} color={PALETTE.text} />
          </Pressable>
        )}

        {showProfile && (
          <Pressable
            onPress={handleProfilePress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: PALETTE.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0F81A3',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <User size={20} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
};
