import { Alert } from '../data/mockAlerts';

export async function setupNotificationChannel(): Promise<void> {
  // Not applicable on web in the same way, but we can check if Notifications are supported
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  
  if (Notification.permission === "granted") return true;
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
}

export async function fireAlertNotification(alert: Alert): Promise<void> {
  if (Notification.permission === "granted") {
    const notification = new Notification(alert.title_ur, {
      body: alert.description_ur.substring(0, 100) + "...",
      icon: '/favicon.ico', // Fallback to favicon or a dedicated icon if available
      badge: '/favicon.ico',
      tag: alert.id
    });

    notification.onclick = () => {
      window.focus();
      // On web we'd typically navigate via React Router if we had access here, 
      // but simple window focus is a start.
      // In a real PWA context, the Service Worker handles the click.
    };
  } else {
    console.log("Notification permission not granted for alert:", alert.title_ur);
  }
}

export function setupNotificationHandlers(navigate: (path: string) => void): void {
  // This is a simplified version for the web.
  // In a mobile app, this would handle background clicks.
}
