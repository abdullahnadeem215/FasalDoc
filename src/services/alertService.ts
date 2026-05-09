import axios from 'axios';
import { MOCK_ALERTS, Alert } from '../data/mockAlerts';

// Replace with your real URL when ready
const ALERTS_URL = 'https://raw.githubusercontent.com/abdullahsheikh6883/fasaldoc-alerts/main/alerts.json';
const SHOWN_ALERTS_KEY = 'shown_alerts_ids';
const ALERT_HISTORY_KEY = 'alert_history_list';

export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const response = await axios.get(ALERTS_URL, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.warn("Remote alerts fetch failed, using mock data:", error);
    return MOCK_ALERTS;
  }
}

export async function getAlertsForDistrict(district: string): Promise<Alert[]> {
  const allAlerts = await fetchAlerts();
  const lowerDistrict = district.toLowerCase();
  
  return allAlerts.filter(alert => 
    alert.affected_districts.some(d => d.toLowerCase() === lowerDistrict)
  );
}

export async function isAlertAlreadyShown(alertId: string): Promise<boolean> {
  const shownIds = JSON.parse(localStorage.getItem(SHOWN_ALERTS_KEY) || '[]');
  return shownIds.includes(alertId);
}

export async function markAlertAsShown(alertId: string): Promise<void> {
  const shownIds = JSON.parse(localStorage.getItem(SHOWN_ALERTS_KEY) || '[]');
  if (!shownIds.includes(alertId)) {
    shownIds.push(alertId);
    localStorage.setItem(SHOWN_ALERTS_KEY, JSON.stringify(shownIds));
  }
}

export async function saveAlertToHistory(alert: Alert): Promise<void> {
  const history = JSON.parse(localStorage.getItem(ALERT_HISTORY_KEY) || '[]');
  if (!history.find((a: Alert) => a.id === alert.id)) {
    history.unshift(alert); // Newest first
    localStorage.setItem(ALERT_HISTORY_KEY, JSON.stringify(history));
  }
}

export async function getAlertHistory(): Promise<Alert[]> {
  return JSON.parse(localStorage.getItem(ALERT_HISTORY_KEY) || '[]');
}
