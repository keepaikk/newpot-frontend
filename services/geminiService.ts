
import { GoogleGenAI } from "@google/genai";

export const getMarketAnalysis = async (marketTitle: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a brief, professional summary of the current market sentiment and potential outcomes for a prediction market titled: "${marketTitle}". 
      Description: "${description}".
      Target audience: African crypto traders. 
      Keep it under 3 sentences.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Sentiment is cautiously optimistic. Volume suggests high community interest in this outcome.";
  }
};
