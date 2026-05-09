import BackgroundFetch from 'react-native-background-fetch';
import { getUserDistrict } from './locationService';
import { getAlertsForDistrict, markAlertAsShown, saveAlertToHistory } from './alertService';
import { fireAlertNotification } from './notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function runBackgroundAlertCheck() {
  console.log("[BackgroundFetch] Running alert check...");
  try {
    const location = await getUserDistrict();
    const alerts = await getAlertsForDistrict(location.district);
    
    const shownData = await AsyncStorage.getItem('shown_alerts_ids');
    const shownIds = shownData ? JSON.parse(shownData) : [];

    for (const alert of alerts) {
      if (!shownIds.includes(alert.id)) {
        await fireAlertNotification(alert);
        shownIds.push(alert.id);
        await saveAlertToHistory(alert);
      }
    }
    await AsyncStorage.setItem('shown_alerts_ids', JSON.stringify(shownIds));
  } catch (error) {
    console.error("[BackgroundFetch] Error:", error);
  }
}

export async function registerBackgroundAlertTask() {
  const status = await BackgroundFetch.configure({
    minimumFetchInterval: 15, // 15 minutes
    stopOnTerminate: false,
    enableHeadless: true,
    startOnBoot: true,
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
  }, async (taskId) => {
    console.log("[BackgroundFetch] TaskId:", taskId);
    await runBackgroundAlertCheck();
    BackgroundFetch.finish(taskId);
  }, async (taskId) => {
    console.warn("[BackgroundFetch] TIMEOUT:", taskId);
    BackgroundFetch.finish(taskId);
  });

  console.log("[BackgroundFetch] Status:", status);
}
