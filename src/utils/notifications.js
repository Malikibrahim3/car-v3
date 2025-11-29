/**
 * Native Notifications Utility
 * Uses react-native-toast-message for cross-platform notifications
 */

import Toast from 'react-native-toast-message';

export const showNotification = {
  success: (title, message) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
  
  error: (title, message) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },
  
  info: (title, message) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
  
  warning: (title, message) => {
    Toast.show({
      type: 'info', // Toast doesn't have warning, use info
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
};

export default showNotification;
