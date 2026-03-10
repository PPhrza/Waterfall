import { Type, GoogleGenAI } from "@google/genai";

export type WaterLevel = 'ปริมาณน้ำน้อย' | 'ปริมาณน้ำพอดี (เหมาะกับการเล่น)' | 'ปริมาณน้ำมาก (อันตราย)';

export interface PredictionInput {
  waterfallName: string;
  rainfall24h: number;
  month: number;
}

// Sensitivity factors (0 to 1, higher means more sensitive to rain)
const sensitivityMap: Record<string, number> = {
  'น้ำตกพลิ้ว': 0.4,
  'คลองนารายณ์': 0.5,
  'ตรอกนอง': 0.5,
  'สอยดาว': 0.8, // High altitude
  'กระทิง': 0.6,
  'คลองไพบูลย์': 0.5,
  'เขาสิบห้าชั้น': 0.9, // Very sensitive
};

export function predictWaterLevel(input: PredictionInput): WaterLevel {
  const { waterfallName, rainfall24h, month } = input;
  const sensitivity = sensitivityMap[waterfallName] || 0.5;

  // Seasonal base (0 to 100)
  // Rainy season: May (5) to October (10)
  const isRainySeason = month >= 5 && month <= 10;
  const baseLevel = isRainySeason ? 40 : 10;

  // Rain impact
  // For sensitive waterfalls, 40mm might be dangerous.
  // For less sensitive ones, 80mm might be dangerous.
  const rainImpact = rainfall24h * (1 + sensitivity);
  const totalScore = baseLevel + rainImpact;

  if (totalScore < 30) {
    return 'ปริมาณน้ำน้อย';
  } else if (totalScore < 85) {
    return 'ปริมาณน้ำพอดี (เหมาะกับการเล่น)';
  } else {
    return 'ปริมาณน้ำมาก (อันตราย)';
  }
}

/**
 * Bonus: This is how you would implement it in Python with Scikit-learn
 * (Just a string representation for the user)
 */
export const pythonCodeSnippet = `
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder

# 1. Load Data
df = pd.read_csv('waterfalls.csv')

# 2. Preprocessing
le_name = LabelEncoder()
df['waterfall_name_encoded'] = le_name.fit_transform(df['waterfall_name'])

X = df[['waterfall_name_encoded', 'rainfall_24h', 'month']]
y = df['water_level']

# 3. Train Model
model = DecisionTreeClassifier()
model.fit(X, y)

# 4. Predict
def predict(name, rain, month):
    name_encoded = le_name.transform([name])[0]
    return model.predict([[name_encoded, rain, month]])[0]

print(predict('สอยดาว', 50, 10))
`;
