/**
 * Native Loading Spinner Component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IOSActivityIndicator as ActivityIndicator, IOSText as Text } from './ios';

export function LoadingSpinner({ message = 'Loading...', size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
      {message && (
        <Text variant="bodyMedium" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 16,
    opacity: 0.7,
  },
});

export default LoadingSpinner;
