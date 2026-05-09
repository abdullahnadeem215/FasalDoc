export interface Alert {
  id: string;
  type: 'pest' | 'weather' | 'locust' | 'disease';
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  crop: string;
  crop_ur: string;
  title_ur: string;
  title_en: string;
  description_ur: string;
  description_en: string;
  precautions_ur: string[];
  precautions_en: string[];
  affected_districts: string[];
  valid_from: string;
  valid_until: string;
  source: string;
}

export const MOCK_ALERTS: Alert[] = [
  {
    id: "alert_001",
    type: "disease",
    severity: "High",
    crop: "wheat",
    crop_ur: "گندم",
    title_ur: "گندم میں تنا زنگ کا خطرہ",
    title_en: "Wheat Stem Rust Alert",
    description_ur: "پنجاب کے مرکزی اضلاع میں گندم کے تنا زنگ کی بیماری تیزی سے پھیل رہی ہے۔ فوری اقدامات ضروری ہیں۔",
    description_en: "Wheat stem rust spreading rapidly across central Punjab districts. Immediate action required.",
    precautions_ur: [
      "فوری طور پر پروپیکونازول فنگی سائیڈ لگائیں",
      "متاثرہ پودوں کو کھیت سے الگ کریں",
      "اگلے 7 دنوں تک روزانہ فصل کا معائنہ کریں",
      "پڑوسی کسانوں کو بھی آگاہ کریں",
      "محکمہ زراعت کے ہیلپ لائن 0800-15000 پر کال کریں"
    ],
    precautions_en: [
      "Apply Propiconazole fungicide immediately",
      "Remove infected plants from the field",
      "Inspect crop daily for next 7 days",
      "Alert neighboring farmers",
      "Call agriculture helpline 0800-15000"
    ],
    affected_districts: ["Faisalabad", "Sargodha", "Jhang", "Toba Tek Singh", "Chiniot", "Gujranwala", "Sheikhupura"],
    valid_from: "2026-04-01",
    valid_until: "2026-06-30",
    source: "Pakistan Agriculture Research Council"
  },
  {
    id: "alert_002",
    type: "pest",
    severity: "Severe",
    crop: "cotton",
    crop_ur: "کپاس",
    title_ur: "کپاس میں سفید مکھی کا حملہ",
    title_en: "Cotton Whitefly Infestation Alert",
    description_ur: "جنوبی پنجاب اور سندھ میں کپاس کی فصل پر سفید مکھی کا شدید حملہ ہو رہا ہے۔ کپاس پتہ مروڑ وائرس پھیلنے کا خدشہ ہے۔",
    description_en: "Severe whitefly attack on cotton crops in South Punjab and Sindh. Risk of Cotton Leaf Curl Virus spreading.",
    precautions_ur: [
      "امیڈاکلوپرڈ 200SL ایک لیٹر فی ہیکٹر سپرے کریں",
      "صبح یا شام سپرے کریں، دھوپ میں نہیں",
      "پیلے چپکنے والے کارڈ نصب کریں",
      "متاثرہ پتوں کو توڑ کر جلا دیں",
      "سپرے کا اثر 7 دن بعد دیکھیں"
    ],
    precautions_en: [
      "Spray Imidacloprid 200SL at 1L per hectare",
      "Spray in morning or evening, not in sunlight",
      "Install yellow sticky traps",
      "Remove and burn infected leaves",
      "Check spray effectiveness after 7 days"
    ],
    affected_districts: ["Multan", "Bahawalpur", "Rahim Yar Khan", "Muzaffargarh", "Khanewal", "Vehari", "Hyderabad", "Sukkur"],
    valid_from: "2026-04-01",
    valid_until: "2026-08-31",
    source: "Pakistan Central Cotton Committee"
  },
  {
    id: "alert_003",
    type: "weather",
    severity: "Medium",
    crop: "rice",
    crop_ur: "چاول",
    title_ur: "چاول میں بلاسٹ بیماری کا موسمی خطرہ",
    title_en: "Rice Blast Disease Weather Risk",
    description_ur: "زیادہ نمی اور گرم موسم کی وجہ سے چاول بلاسٹ بیماری کا خطرہ بڑھ گیا ہے۔ احتیاطی سپرے کریں۔",
    description_en: "High humidity and warm weather increasing risk of rice blast disease. Apply preventive spray.",
    precautions_ur: [
      "ٹرائی سائکلازول فنگی سائیڈ کا احتیاطی سپرے کریں",
      "کھیت میں پانی کی سطح کم رکھیں",
      "نائٹروجن کھاد کم ڈالیں",
      "پودوں کے درمیان فاصلہ بڑھائیں",
      "مزاحم اقسام اگلے سیزن میں لگائیں"
    ],
    precautions_en: [
      "Apply Tricyclazole fungicide preventively",
      "Maintain lower water level in fields",
      "Reduce nitrogen fertilizer application",
      "Increase spacing between plants",
      "Plant resistant varieties next season"
    ],
    affected_districts: ["Sheikhupura", "Sialkot", "Gujranwala", "Hafizabad", "Narowal", "Larkana", "Sukkur"],
    valid_from: "2026-05-01",
    valid_until: "2026-09-30",
    source: "Pakistan Meteorological Department"
  },
  {
    id: "alert_004",
    type: "locust",
    severity: "Severe",
    crop: "all",
    crop_ur: "تمام فصلیں",
    title_ur: "ٹڈی دل کی آمد کا خطرہ",
    title_en: "Desert Locust Swarm Warning",
    description_ur: "سرحدی علاقوں سے ٹڈی دل کے گروہ پاکستان کی طرف آ رہے ہیں۔ تمام کسانوں کو چوکس رہنا چاہیے۔",
    description_en: "Desert locust swarms moving towards Pakistan from border areas. All farmers must remain alert.",
    precautions_ur: [
      "کلوروپائریفوس 48EC سپرے کا انتظام رکھیں",
      "شور مچا کر ٹڈیاں اڑائیں — آواز اور دھواں کریں",
      "فصل ڈھکنے کا انتظام کریں",
      "ضلع انتظامیہ کو فوری اطلاع دیں",
      "نیشنل لوکسٹ کنٹرول سینٹر: 051-9204346"
    ],
    precautions_en: [
      "Arrange Chloropyrifos 48EC spray",
      "Scare locusts with noise and smoke",
      "Cover crops if possible",
      "Immediately alert district administration",
      "National Locust Control Centre: 051-9204346"
    ],
    affected_districts: ["Quetta", "Chaman", "Khuzdar", "Turbat", "Dera Ghazi Khan", "Rajanpur", "Loralai"],
    valid_from: "2026-03-01",
    valid_until: "2026-07-31",
    source: "FAO Pakistan & NLCC"
  }
];
