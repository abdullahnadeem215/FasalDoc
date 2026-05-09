import axios from 'axios';
import { getApiKey } from '../utils/storage';
import { DiseaseResult } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const analyzeCropDisease = async (base64Image: string): Promise<DiseaseResult> => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error('API Key missing. Please set it in Settings.');
  }

  const prompt = `Analyze this crop image and identify any disease. 
  Provide the result strictly in JSON format with exactly these fields:
  diseaseName_en, diseaseName_ur, severity (one of: Low, Medium, High, Severe), confidence (0-1), 
  symptoms_en, symptoms_ur, treatment_en, treatment_ur, prevention_en, prevention_ur.
  Focus on common crops in Pakistan like Wheat, Rice, Cotton, Sugarcane. 
  If the plant is healthy, indicate "Healthy" in disease names.`;

  try {
    const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
        ]
      }],
      generationConfig: {
        response_mime_type: "application/json",
      }
    });

    const resultText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText) as DiseaseResult;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error.response?.status === 400) {
      throw new Error('Invalid request or API key.');
    }
    throw new Error('Could not analyze image. Check your internet connection.');
  }
};
