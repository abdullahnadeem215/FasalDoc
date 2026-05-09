export const translations = {
  ur: {
    home: 'ہوم',
    history: 'تاریخ',
    settings: 'سیٹنگز',
    alerts: 'الرٹس',
    appTitle: 'FasalDoc',
    appSubtitle: 'فصل کی بیماری پہچانیں',
    takePhoto: 'تصویر لیں',
    chooseGallery: 'گیلری',
    quickSamples: 'عام فصلیں',
    loading: 'بیماری کی پہچان ہو رہی ہے...',
    description: 'پاکستانی کسانوں کے لیے اے آئی پاورڈ سسٹم',
    analyzing: 'تجزیہ کیا جا رہا ہے...',
    noHistory: 'کوئی تاریخ نہیں',
    noResults: 'کوئی نتیجہ نہیں ملا',
    search: 'تلاش کریں...',
    save: 'محفوظ کریں',
    saved: 'محفوظ ہو گیا',
    scanAgain: 'دوبارہ اسکین کریں',
    apiKey: 'البتہ کی (API Key)',
    getApiKey: 'مفت API کی حاصل کریں',
    languageSelect: 'زبان کا انتخاب',
    symptoms: 'علامات',
    treatment: 'علاج',
    prevention: 'بچاؤ',
    healthy: 'صحت مند پودا',
    notAPlant: 'پودے کی تصویر نہیں ہے',
    severity: {
      Low: 'کم',
      Medium: 'درمیانہ',
      High: 'شدید',
      Severe: 'بہت شدید'
    }
  },
  en: {
    home: 'Home',
    history: 'History',
    settings: 'Settings',
    alerts: 'Alerts',
    appTitle: 'FasalDoc',
    appSubtitle: 'Identify Crop Diseases',
    takePhoto: 'Take Photo',
    chooseGallery: 'Gallery',
    quickSamples: 'Common Crops',
    loading: 'Identifying disease...',
    description: 'AI-powered pathology for Pakistani farmers',
    analyzing: 'Analyzing with AI...',
    noHistory: 'No history found',
    noResults: 'No results found',
    search: 'Search...',
    save: 'Save Result',
    saved: 'Result Saved',
    scanAgain: 'Scan Again',
    apiKey: 'API Key',
    getApiKey: 'Get free API Key',
    languageSelect: 'Select Language',
    symptoms: 'Symptoms',
    treatment: 'Treatment',
    prevention: 'Prevention',
    healthy: 'Healthy Plant',
    notAPlant: 'Not a plant image',
    severity: {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
      Severe: 'Severe'
    }
  }
};

export type Language = 'ur' | 'en';
export type TranslationKey = keyof typeof translations.ur;
