import { GoogleGenAI } from "@google/genai";
import { WeatherResponse, WeatherData, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WEATHER_PROMPT = `
You are a real-time weather agent.
1. Search for the current weather and the hourly forecast for the next 6 hours for the requested location.
2. Return the data in STRICT JSON format. Do not add markdown formatting (like \`\`\`json). Just return the raw JSON string.
3. The JSON must match this structure exactly:
{
  "location": "City, Country",
  "current": {
    "temp_c": number (degrees Celsius),
    "condition": "string (e.g. Sunny, Rainy)",
    "humidity": number (percentage),
    "wind_kph": number (kilometers per hour),
    "feels_like_c": number,
    "uv_index": number,
    "description": "A short, helpful sentence about the weather (e.g. 'Perfect for a run, but bring sunglasses.')."
  },
  "forecast": [
    { "time": "HH:MM", "temp_c": number, "condition": "short string" }
  ]
}
`;

export const getWeather = async (locationQuery: string): Promise<WeatherResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `${WEATHER_PROMPT}\n\nLocation Request: ${locationQuery}`,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType is NOT allowed with googleSearch, so we parse manually
      },
    });

    const text = response.text || "{}";
    
    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    // Clean up response if the model wraps it in markdown blocks despite instructions
    let jsonString = text.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '');
    }

    try {
      const weatherData: WeatherData = JSON.parse(jsonString);
      return { data: weatherData, sources };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", text);
      return { 
        data: null, 
        sources, 
        error: "Failed to parse weather data from AI response. Please try again." 
      };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      data: null, 
      sources: [], 
      error: error instanceof Error ? error.message : "An unexpected error occurred." 
    };
  }
};
