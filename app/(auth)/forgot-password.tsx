import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, useTheme, HelperText } from 'react-native-paper';
import { IOSText as Text, IOSButton as Button } from '../../src/components/ios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const theme = useTheme();
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error.message,
      });
    } else {
      setSuccess(true);
      Toast.show({
        type: 'success',
        text1: 'Check Your Email',
        text2: 'Password reset link sent',
      });
    }
    
    setLoading(false);
  };
  
  if (success) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text variant="displaySmall" style={styles.successIcon}>
              ✓
            </Text>
            <Text variant="headlineMedium" style={styles.title}>
              Check Your Email
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              We've sent a password reset link to {email}
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/(auth)/login')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Back to Sign In
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            Reset Password
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Enter your email to receive a reset link
          </Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            error={!!error}
          />
          
          {error && (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          )}
          
          <Button
            mode="contained"
            onPress={handleReset}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Send Reset Link
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Back to Sign In
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
  successContainer: {
    alignItems: 'center',
    gap: 16,
  },
  successIcon: {
    fontSize: 64,
    color: '#10B981',
  },
});
