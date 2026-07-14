import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

for (const model of models) {
  try {
    const res = await ai.models.generateContent({
      model,
      contents: "Say OK",
    });

    console.log(`✅ ${model} works`);
    console.log(res.text);
  } catch (e) {
    console.log(`❌ ${model}`);
    console.log(e.message);
    console.log("----------------------");
  }
}