import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface WordInfo {
  definition: string;
  personalExample: string;
  keyword: string;
}

export async function getWordDetails(word: string): Promise<WordInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide details for the English word: "${word}". 
    Include a simple definition, a personal-style example sentence, and a short mnemonic or keyword to help remember it.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: {
            type: Type.STRING,
            description: "A simple, clear definition of the word.",
          },
          personalExample: {
            type: Type.STRING,
            description: "A relatable, personal-style example sentence.",
          },
          keyword: {
            type: Type.STRING,
            description: "A short mnemonic, keyword, or memory aid.",
          },
        },
        required: ["definition", "personalExample", "keyword"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as WordInfo;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Failed to generate word details");
  }
}
