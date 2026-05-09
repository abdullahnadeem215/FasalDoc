export interface DiseaseResult {
  healthy: boolean;
  crop_type_en: string;
  crop_type_ur: string;
  disease_name_en: string | null;
  disease_name_ur: string | null;
  severity: 'Low' | 'Medium' | 'High' | 'Severe' | null;
  confidence_percent: number;
  symptoms_ur: string | null;
  symptoms_en: string | null;
  treatment_ur: string | null;
  treatment_en: string | null;
  prevention_ur: string | null;
  prevention_en: string | null;
}

export interface ScanRecord {
  id: string;
  timestamp: number;
  imageUri: string;
  result: DiseaseResult;
}
