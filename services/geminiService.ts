import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePropertyDescription = async (
  title: string,
  specs: string,
  vibe: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Write a compelling, professional real estate listing description for a property.
      Title: ${title}
      Key Features/Specs: ${specs}
      Desired Vibe/Tone: ${vibe}
      
      Keep it under 150 words. Focus on the benefits and lifestyle.
      Do not include markdown formatting like bolding or headers, just the text paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating property description:", error);
    throw error;
  }
};

export const generateChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'EstateBot', the intelligent assistant for EstateFlow CRM. 
        
        About EstateFlow:
        - A comprehensive CRM for real estate professionals.
        - Features: Property Management, Kanban Lead Tracking, AI Listing Generation, Team Collaboration.
        - Pricing: Starter (Free), Pro ($49/mo), Agency ($199/mo).
        
        Your Role:
        - Answer questions about features and pricing.
        - Be enthusiastic, professional, and concise.
        - If asked about technical support or billing issues you can't resolve, direct them to support@estateflow.com.
        - Do not hallucinate features we don't have.
        
        Keep responses under 3 sentences unless asked for details.`,
      },
    });

    return response.text || "I'm not sure how to respond to that, but I'm learning every day!";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm currently experiencing a high volume of requests. Please try again in a moment.";
  }
};
