import { GoogleGenAI } from "@google/genai";
import { DiseaseResult } from "../types";

// Initialize the API client lazily to avoid crashing if the key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function analyzeCropDisease(
  imageBase64: string,
  mimeType: string
): Promise<DiseaseResult> {
  const ai = getAiClient();
  
  const prompt = `You are an expert agricultural pathologist specializing in Pakistani crops including wheat (گندم), cotton (کپاس), rice (چاول), sugarcane (گنا), and maize (مکئی).

Analyze this crop photo carefully and respond ONLY with a valid JSON object. No markdown, no explanation, just JSON.

{
  "healthy": false,
  "crop_type_en": "Wheat",
  "crop_type_ur": "گندم",
  "disease_name_en": "Wheat Stem Rust",
  "disease_name_ur": "گندم کا تنا زنگ",
  "severity": "High",
  "confidence_percent": 94,
  "symptoms_ur": "تنے اور پتوں پر نارنجی بھورے پاؤڈر دار دھبے۔ پتے زرد پڑ جاتے ہیں۔",
  "symptoms_en": "Orange-brown powdery pustules on stem and leaves. Leaves turn yellow.",
  "treatment_ur": "48 گھنٹوں کے اندر پروپیکونازول فنگی سائیڈ لگائیں۔ شدید متاثرہ پودے جلا دیں۔",
  "treatment_en": "Apply Propiconazole fungicide within 48 hours. Burn heavily infected plants.",
  "prevention_ur": "مزاحم اقسام جیسے NARC-11 لگائیں۔ فصل کی گردش کریں۔ نائٹروجن زیادہ نہ ڈالیں۔",
  "prevention_en": "Plant resistant varieties like NARC-11. Practice crop rotation. Avoid excess nitrogen."
}

If the plant is healthy, set healthy: true and disease fields to null.
If the image is not a plant, set disease_name_en to "Not a plant image".
Always respond in this exact JSON structure. Severity must be one of: Low, Medium, High, Severe.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("نتیجہ پڑھنے میں خرابی (No response text)");
    }

    return JSON.parse(jsonStr) as DiseaseResult;
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("API key غلط ہے");
    }
    if (error.message?.includes("fetch")) {
      throw new Error("انٹرنیٹ کنیکشن چیک کریں");
    }
    throw new Error("نتیجہ پڑھنے میں خرابی");
  }
}
