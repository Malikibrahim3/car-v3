/**
 * App Header with Drawer Menu
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { IOSIconButton as IconButton, IOSChip as Chip } from '../ios';
import { useRouter } from 'expo-router';
import { useCarContext } from '../../context/CarContext';

export default function AppHeader({ title, showMenu = true }) {
  const theme = useTheme();
  const router = useRouter();
  const { isDemoMode } = useCarContext();
  const [menuVisible, setMenuVisible] = useState(false);
  
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      {showMenu && (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <View style={{ marginLeft: 4 }}>
              <IconButton
                icon="menu"
                iconColor="white"
                onPress={() => setMenuVisible(true)}
                style={{ backgroundColor: 'transparent' }}
              />
            </View>
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/dashboard');
            }}
            title="Dashboard"
            leadingIcon="view-dashboard"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/garage');
            }}
            title="My Garage"
            leadingIcon="car-multiple"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/estimate');
            }}
            title="Value Estimator"
            leadingIcon="calculator"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/forecast');
            }}
            title="Financial Forecast"
            leadingIcon="chart-line"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/achievements');
            }}
            title="Achievements"
            leadingIcon="trophy"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/notifications');
            }}
            title="Notifications"
            leadingIcon="bell"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/help');
            }}
            title="Help & Support"
            leadingIcon="help-circle"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              router.push('/(app)/settings');
            }}
            title="Settings"
            leadingIcon="cog"
          />
        </Menu>
      )}
      
      <Appbar.Content 
        title={title}
        titleStyle={{ color: 'white', fontWeight: 'bold' }}
      />
      
      {isDemoMode && (
        <Chip 
          mode="flat" 
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8, height: 44 }}
          textStyle={{ color: 'white', fontSize: 12 }}
        >
          Demo
        </Chip>
      )}
      
      <View style={{ marginRight: 4 }}>
        <IconButton
          icon="bell-outline"
          iconColor="white"
          onPress={() => router.push('/(app)/notifications')}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
});
