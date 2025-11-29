/**
 * Login Screen - Clean, Polished Design
 */
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../src/constants/AutoTrackDesign';
import { IOSText as Text } from '../../src/components/ios';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/(tabs)/dashboard');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Back Button */}
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={24} color={Colors.text} />
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Welcome back to AutoTrack</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textTertiary}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    {showPassword ? <EyeOff size={20} color={Colors.textTertiary} /> : <Eye size={20} color={Colors.textTertiary} />}
                  </Pressable>
                </View>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable onPress={handleLogin} disabled={loading} style={styles.buttonWrapper}>
                <LinearGradient colors={Colors.gradientBrand} style={styles.signInButton}>
                  {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signInText}>Sign In</Text>}
                </LinearGradient>
              </Pressable>

              <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.noAccountText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -12 },
  header: { marginBottom: 32 },
  title: { ...Typography.largeTitle, color: Colors.text, fontSize: 32, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary },
  form: { marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: Colors.surface, borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: 'absolute', right: 14, top: 14 },
  error: { ...Typography.caption, color: Colors.negative, marginBottom: 16, textAlign: 'center' },
  buttonWrapper: { marginTop: 8, ...Shadows.brandGlow },
  signInButton: { height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  signInText: { ...Typography.headline, color: 'white', fontWeight: '600' },
  forgotText: { ...Typography.body, color: Colors.brand, textAlign: 'center', marginTop: 16 },
  footer: { alignItems: 'center' },
  noAccountText: { ...Typography.body, color: Colors.textSecondary, marginBottom: 4 },
  signUpLink: { ...Typography.body, color: Colors.brand, fontWeight: '600' },
});
