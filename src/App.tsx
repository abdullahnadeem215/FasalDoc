/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppNavigator from './navigation/AppNavigator';
import { LanguageProvider } from './contexts/LanguageContext';
import { setupNotificationChannel, requestNotificationPermission } from './services/notificationService';
import { requestLocationPermission } from './services/locationService';
import { registerBackgroundAlertTask } from './services/backgroundTaskService';

export default function App() {
  useEffect(() => {
    const initServices = async () => {
      await setupNotificationChannel();
      await requestNotificationPermission();
      await requestLocationPermission();
      await registerBackgroundAlertTask();
    };
    
    initServices();
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppNavigator />
      </BrowserRouter>
    </LanguageProvider>
  );
}
