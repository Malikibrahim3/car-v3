/**
 * Test Authentication Helper
 * Auto-login for testing purposes
 */

import { Platform } from 'react-native';
import storage from './storage';

export const enableTestMode = async () => {
  await storage.setItem('test_user_session', 'true');
  console.log('✅ Test mode enabled - user will be auto-logged in');
};

export const disableTestMode = async () => {
  await storage.removeItem('test_user_session');
  console.log('❌ Test mode disabled');
};

// Auto-enable test mode in development (web only)
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  if (window.location && window.location.hostname === 'localhost') {
    enableTestMode();
  }
}
