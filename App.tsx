import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { registerBackgroundAlertTask } from './src/services/backgroundTaskService';
import { setupNotificationChannel } from './src/services/notificationService';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Request Permissions
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          ]);
          
          if (
            granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted['android.permission.ACCESS_FINE_LOCATION'] !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            Alert.alert(
              'Permissions Required',
              'Camera and Location permissions are necessary for crop detection and alerts.'
            );
          }
        } catch (err) {
          console.warn(err);
        }
      }

      // 2. Initialize Background Services
      await setupNotificationChannel();
      await registerBackgroundAlertTask();
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
