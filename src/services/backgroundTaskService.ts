import { getUserDistrict } from './locationService';
import { getAlertsForDistrict, isAlertAlreadyShown, markAlertAsShown, saveAlertToHistory } from './alertService';
import { fireAlertNotification } from './notificationService';

export async function runBackgroundAlertCheck() {
  console.log("Running alert check...");
  try {
    const location = await getUserDistrict();
    const alerts = await getAlertsForDistrict(location.district);
    
    for (const alert of alerts) {
      const alreadyShown = await isAlertAlreadyShown(alert.id);
      if (!alreadyShown) {
        await fireAlertNotification(alert);
        await markAlertAsShown(alert.id);
        await saveAlertToHistory(alert);
      }
    }
  } catch (error) {
    console.error("Alert check failed:", error);
  }
}

export async function registerBackgroundAlertTask() {
  // On web, we simulate background tasks by running them when the app is active.
  // We check once on startup and then every 15 minutes (since 6 hours is too long for a web session).
  
  // Initial check
  runBackgroundAlertCheck();

  // Periodic check (every 15 minutes while app is open)
  setInterval(() => {
    runBackgroundAlertCheck();
  }, 15 * 60 * 1000);
}
