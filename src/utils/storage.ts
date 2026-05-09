import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanRecord } from '../types';

const KEYS = {
  API_KEY: 'gemini_api_key',
  SCANS: 'saved_scans',
  LANGUAGE: 'app_language',
  SHOWN_ALERTS: 'shown_alerts',
  ALERT_HISTORY: 'alert_history'
};

export const saveApiKey = async (key: string) => {
  await AsyncStorage.setItem(KEYS.API_KEY, key);
};

export const getApiKey = async () => {
  return await AsyncStorage.getItem(KEYS.API_KEY);
};

export const saveScan = async (scan: ScanRecord) => {
  const existing = await getScans();
  const updated = [scan, ...existing];
  await AsyncStorage.setItem(KEYS.SCANS, JSON.stringify(updated));
};

export const getScans = async (): Promise<ScanRecord[]> => {
  const data = await AsyncStorage.getItem(KEYS.SCANS);
  return data ? JSON.parse(data) : [];
};

export const deleteScan = async (id: string) => {
  const existing = await getScans();
  const updated = existing.filter(s => s.id !== id);
  await AsyncStorage.setItem(KEYS.SCANS, JSON.stringify(updated));
};

export const clearHistory = async () => {
  await AsyncStorage.removeItem(KEYS.SCANS);
};

export const setLanguage = async (lang: 'en' | 'ur') => {
  await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
};

export const getLanguage = async (): Promise<'en' | 'ur'> => {
  const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
  return (lang as 'en' | 'ur') || 'ur';
};

// Alert Storage
export const markAlertAsShown = async (alertId: string) => {
  const shown = await getShownAlerts();
  if (!shown.includes(alertId)) {
    await AsyncStorage.setItem(KEYS.SHOWN_ALERTS, JSON.stringify([...shown, alertId]));
  }
};

export const getShownAlerts = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(KEYS.SHOWN_ALERTS);
  return data ? JSON.parse(data) : [];
};

export const saveAlertToHistory = async (alert: any) => {
  const history = await getAlertHistory();
  await AsyncStorage.setItem(KEYS.ALERT_HISTORY, JSON.stringify([alert, ...history]));
};

export const getAlertHistory = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(KEYS.ALERT_HISTORY);
  return data ? JSON.parse(data) : [];
};
