
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeTextForQR = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Optimise the following text to be more concise while retaining all vital information, making it more suitable for a QR code (which handles shorter strings better). If it's a URL, don't change it. If it's descriptive text, summarize it. Text: "${text}"`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    return response.text.trim() || text;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return text;
  }
};

export const parseContactInfo = async (info: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract contact information from this text: "${info}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name" },
            org: { type: Type.STRING, description: "Company name" },
            job: { type: Type.STRING, description: "Job title" },
            tel: { type: Type.STRING, description: "Phone number" },
            email: { type: Type.STRING, description: "Email address" },
            address: { type: Type.STRING, description: "Street, City, State, ZIP" },
            url: { type: Type.STRING, description: "Website URL" },
            logo: { type: Type.STRING, description: "URL to a logo or profile photo" },
          },
          required: ["name"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Contact Parsing error:", error);
    return null;
  }
};

export const decodeQRCode = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Read the QR code in this image and return only the raw data it contains. Do not add any explanation or context. If no QR code is found, return 'ERR_NO_QR'.",
        },
      ],
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini QR Decoding error:", error);
    return "ERR_SCAN_FAILED";
  }
};
