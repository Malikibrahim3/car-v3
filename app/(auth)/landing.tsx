/**
 * Landing Screen - First screen users see
 * Clean design with dev sign-in for quick testing
 */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, TrendingUp, PieChart, Zap } from 'lucide-react-native';
import { Colors, Typography, Shadows, Radius, Spacing } from '../../src/constants/AutoTrackDesign';
import { IOSText as Text } from '../../src/components/ios';
import { useAuth } from '../../src/context/AuthContext';
import Toast from 'react-native-toast-message';

export default function Landing() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [devLoading, setDevLoading] = useState(false);

  const handleDevSignIn = async () => {
    setDevLoading(true);
    const { error } = await signIn('admin@gmail.com', 'Boyo1996!');
    if (error) {
      Toast.show({ type: 'error', text1: 'Dev sign-in failed' });
    } else {
      Toast.show({ type: 'success', text1: 'Dev mode activated' });
      router.replace('/(tabs)/dashboard');
    }
    setDevLoading(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={Colors.gradientBrand} style={styles.logoContainer}>
            <Car size={40} color="white" strokeWidth={2} />
          </LinearGradient>
          <Text style={styles.appName}>AutoTrack</Text>
          <Text style={styles.tagline}>Know your car's true value</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <TrendingUp size={20} color={Colors.brand} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Real-Time Tracking</Text>
              <Text style={styles.featureDesc}>Monitor equity as it changes</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <PieChart size={20} color={Colors.brand} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Forecasts</Text>
              <Text style={styles.featureDesc}>Know the best time to sell</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/(auth)/signup')} style={styles.primaryWrapper}>
            <LinearGradient colors={Colors.gradientBrand} style={styles.primaryButton}>
              <Text style={styles.primaryText}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/login')} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Sign In</Text>
          </Pressable>
        </View>

        {/* Dev Sign In */}
        <View style={styles.devContainer}>
          <Pressable onPress={handleDevSignIn} disabled={devLoading} style={styles.devButton}>
            {devLoading ? (
              <ActivityIndicator size="small" color={Colors.brand} />
            ) : (
              <>
                <Zap size={16} color={Colors.brand} />
                <Text style={styles.devText}>Dev Sign In</Text>
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  hero: { alignItems: 'center', paddingTop: 80, paddingBottom: 40 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...Shadows.brandGlow },
  appName: { ...Typography.largeTitle, color: Colors.text, marginTop: 20, fontSize: 36 },
  tagline: { ...Typography.body, color: Colors.textSecondary, marginTop: 8 },
  features: { paddingVertical: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: Colors.surface, padding: 16, borderRadius: Radius.lg },
  featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${Colors.brand}15`, alignItems: 'center', justifyContent: 'center' },
  featureText: { marginLeft: 16, flex: 1 },
  featureTitle: { ...Typography.headline, color: Colors.text },
  featureDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  actions: { marginTop: 'auto', paddingBottom: 16 },
  primaryWrapper: { ...Shadows.brandGlow, marginBottom: 12 },
  primaryButton: { height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  primaryText: { ...Typography.headline, color: 'white', fontWeight: '600', fontSize: 17 },
  secondaryButton: { height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryText: { ...Typography.headline, color: Colors.text, fontWeight: '500' },
  devContainer: { paddingVertical: 20 },
  devButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, borderStyle: 'dashed' },
  devText: { ...Typography.caption, color: Colors.brand, fontWeight: '600' },
});
