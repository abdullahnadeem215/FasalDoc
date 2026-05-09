export interface DiseaseResult {
  diseaseName_en: string;
  diseaseName_ur: string;
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  confidence: number;
  symptoms_en: string;
  symptoms_ur: string;
  treatment_en: string;
  treatment_ur: string;
  prevention_en: string;
  prevention_ur: string;
  urdu_audio_url?: string;
}

export interface ScanRecord {
  id: string;
  date: string;
  imageUri: string;
  result: DiseaseResult;
}

export type RootStackParamList = {
  HomeStack: undefined;
  Alerts: undefined;
  History: undefined;
  Settings: undefined;
  Result: { 
    result: DiseaseResult;
    imageUri: string;
    isFresh?: boolean;
  };
};
