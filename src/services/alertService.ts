import axios from 'axios';
import { MOCK_ALERTS, Alert } from '../data/mockAlerts';
import { getShownAlerts, markAlertAsShown, saveAlertToHistory } from '../utils/storage';

const ALERTS_URL = 'https://raw.githubusercontent.com/abdullahsheikh6883/fasaldoc-alerts/main/alerts.json';

export async function fetchAlerts(): Promise<Alert[]> {
  try {
    const response = await axios.get(ALERTS_URL, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.warn("Remote alerts fetch failed, using mock data");
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

export { isAlertAlreadyShown } from '../utils/storage'; // Re-exporting if needed
export { markAlertAsShown, saveAlertToHistory, getAlertHistory } from '../utils/storage';
