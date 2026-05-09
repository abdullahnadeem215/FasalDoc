import notifee, { AndroidImportance } from '@notifee/react-native';
import { Alert } from '../data/mockAlerts';

export async function setupNotificationChannel(): Promise<void> {
  await notifee.createChannel({
    id: 'crop_alerts',
    name: 'Crop Alerts',
    lights: true,
    vibration: true,
    importance: AndroidImportance.HIGH,
  });
}

export async function fireAlertNotification(alert: Alert): Promise<void> {
  await notifee.displayNotification({
    title: alert.title_ur,
    body: alert.description_ur.substring(0, 100) + "...",
    android: {
      channelId: 'crop_alerts',
      smallIcon: 'ic_launcher', // ensure this exists in android project
      pressAction: {
        id: 'default',
      },
    },
  });
}

export function setupNotificationHandlers(navigation: any): void {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === 1) { // EventType.PRESS
      navigation.navigate('Alerts');
    }
  });
}
