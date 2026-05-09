import { ScanRecord } from "../types";

const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SCAN_HISTORY: 'scan_history',
  LANGUAGE: 'app_language'
};

export const storage = {
  getApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  },
  setApiKey: (key: string) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  },
  
  getHistory: (): ScanRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  },
  saveToHistory: (record: ScanRecord): boolean => {
    try {
      const history = storage.getHistory();
      const updatedHistory = [record, ...history];
      localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
      return true;
    } catch (e) {
      console.error("Storage Error:", e);
      return false;
    }
  },
  removeFromHistory: (id: string) => {
    const history = storage.getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
  },

  getLanguage: (): 'ur' | 'en' => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'ur' | 'en') || 'ur';
  },
  setLanguage: (lang: 'ur' | 'en') => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }
};
