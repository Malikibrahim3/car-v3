/**
 * IOSModal - iOS-style modal component
 * Replaces react-native-paper Modal + Portal
 */
import React from 'react';
import { Modal, View, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { IOS_RADIUS, IOS_PADDING } from './theme';

interface IOSModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  dismissable?: boolean;
}

export const IOSModal: React.FC<IOSModalProps> = ({ 
  visible, 
  onDismiss, 
  children,
  dismissable = true 
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Pressable 
          style={styles.backdrop} 
          onPress={dismissable ? onDismiss : undefined}
        >
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: IOS_PADDING,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: IOS_RADIUS,
    padding: IOS_PADDING,
    width: '100%',
    maxWidth: 500,
  },
});
