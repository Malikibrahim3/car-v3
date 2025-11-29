/**
 * Profile - Premium Settings
 * 
 * Rich profile page with:
 * - Gradient user card
 * - Premium settings rows
 * - Beautiful styling
 */

import React, { useState } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  Switch, 
  Pressable, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Moon, 
  Bell, 
  Shield, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  Crown
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, haptic, IconSizes } from '@/src/constants/AutoTrackDesign';

interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value?: boolean;
  isSwitch?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  isLast?: boolean;
  destructive?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconBg,
  label,
  value,
  isSwitch = false,
  onPress,
  onValueChange,
  isLast = false,
  destructive = false,
}) => (
  <Pressable
    onPress={() => {
      if (!isSwitch && onPress) {
        haptic.light();
        onPress();
      }
    }}
    disabled={isSwitch}
    style={({ pressed }) => [
      styles.settingsRow,
      !isLast && styles.settingsRowBorder,
      pressed && !isSwitch && styles.settingsRowPressed,
    ]}
  >
    <View style={[styles.settingsIcon, { backgroundColor: iconBg }]}>
      {icon}
    </View>
    <Text style={[
      styles.settingsLabel,
      destructive && styles.settingsLabelDestructive,
    ]}>
      {label}
    </Text>
    {isSwitch ? (
      <Switch
        value={value}
        onValueChange={(newValue) => {
          haptic.selection();
          onValueChange?.(newValue);
        }}
        trackColor={{ 
          false: Colors.border, 
          true: Colors.positive 
        }}
        thumbColor="#FFFFFF"
      />
    ) : (
      <ChevronRight size={IconSizes.sm} color={Colors.textTertiary} />
    )}
  </Pressable>
);

export default function ProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Large Title */}
          <Text style={styles.largeTitle} accessibilityRole="header">Profile</Text>

          {/* User Card */}
          <View style={styles.userCardContainer}>
            <LinearGradient
              colors={Colors.gradientBrand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userCard}
            >
              <View style={styles.userAvatar}>
                <Text style={styles.userInitials}>JD</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>John Doe</Text>
                <View style={styles.proBadge}>
                  <Crown size={14} color={Colors.warning} />
                  <Text style={styles.proBadgeText}>Pro Member</Text>
                </View>
              </View>
              <ChevronRight size={IconSizes.md} color="rgba(255,255,255,0.6)" />
            </LinearGradient>
          </View>

          {/* Preferences Section */}
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<Moon size={IconSizes.sm} color="#FFFFFF" />}
              iconBg="#5856D6"
              label="Dark Mode"
              value={darkMode}
              isSwitch
              onValueChange={setDarkMode}
            />
            <SettingsRow
              icon={<Bell size={IconSizes.sm} color="#FFFFFF" />}
              iconBg={Colors.negative}
              label="Notifications"
              value={notifications}
              isSwitch
              onValueChange={setNotifications}
            />
            <SettingsRow
              icon={<Shield size={IconSizes.sm} color="#FFFFFF" />}
              iconBg={Colors.brand}
              label="Privacy & Security"
              onPress={() => {}}
              isLast
            />
          </View>

          {/* Support Section */}
          <Text style={styles.sectionHeader}>SUPPORT</Text>
          <View style={styles.settingsCard}>
            <SettingsRow
              icon={<HelpCircle size={IconSizes.sm} color="#FFFFFF" />}
              iconBg={Colors.warning}
              label="Help Center"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Settings size={IconSizes.sm} color="#FFFFFF" />}
              iconBg={Colors.textSecondary}
              label="App Settings"
              onPress={() => router.push('/(app)/settings')}
              isLast
            />
          </View>

          {/* Sign Out Section */}
          <View style={[styles.settingsCard, { marginTop: Spacing.xl }]}>
            <SettingsRow
              icon={<LogOut size={IconSizes.sm} color="#FFFFFF" />}
              iconBg={Colors.negative}
              label="Sign Out"
              onPress={() => {}}
              isLast
              destructive
            />
          </View>

          {/* Version */}
          <Text style={styles.versionText}>AutoTrack v1.0.0</Text>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    maxWidth: '100%',
  },
  
  // Large Title
  largeTitle: {
    ...Typography.largeTitle,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  
  // User Card
  userCardContainer: {
    marginBottom: Spacing.xl,
    ...Shadows.brandGlow,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInitials: {
    ...Typography.title2,
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.headline,
    color: 'white',
    marginBottom: 4,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  proBadgeText: {
    ...Typography.micro,
    color: 'white',
  },
  
  // Section
  sectionHeader: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  
  // Settings Card
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsRowPressed: {
    backgroundColor: Colors.borderLight,
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingsLabel: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  settingsLabelDestructive: {
    color: Colors.negative,
  },
  
  // Version
  versionText: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
