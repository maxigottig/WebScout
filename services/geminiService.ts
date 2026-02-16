
import { GoogleGenAI, Chat } from "@google/genai";
import { Location, SearchResult } from "../types";

// Helper to initialize GoogleGenAI with the current API key.
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Searches for local businesses using Google Maps grounding.
 */
export const searchBusinessesWithoutWebsites = async (
  query: string,
  location?: Location,
  radius: number = 5
): Promise<SearchResult> => {
  const ai = getAi();
  const systemInstruction = `
    Eres un consultor de estrategia digital experto en pequeñas empresas.
    Tu objetivo es analizar una categoría de negocio para identificar quiénes TIENEN presencia web y quiénes NO.
    
    Para cada búsqueda:
    1. Clasifica los negocios en "OPORTUNIDADES (Sin Sitio Web)" y "PRESENCIA DIGITAL (Con Sitio Web)".
    2. Para los negocios SIN sitio web, explica detalladamente las VENTAJAS de digitalizarse (ej. mayor visibilidad, ventas 24/7, credibilidad, SEO local).
    3. Céntrate estrictamente en el radio de búsqueda especificado (${radius} km).
    4. No te enfoques en dar coordenadas o direcciones exactas en el texto del reporte, céntrate en el valor del sitio web.
    5. Asegúrate de que el modelo use la herramienta de Google Maps para identificar los negocios y proporcionar los enlaces correspondientes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza comercios de tipo "${query}" en un radio estricto de ${radius} km cerca de ${location ? `${location.latitude}, ${location.longitude}` : "mi ubicación"}. Identifica su estado web y ventajas de mejora.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: location ? {
            latLng: { latitude: location.latitude, longitude: location.longitude }
          } : undefined
        },
        systemInstruction
      },
    });

    return {
      text: response.text || "No se encontraron detalles.",
      sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as any[]
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Error al consultar la API.");
  }
};

/**
 * Generates an illustrative 3D image for the search category.
 */
export const generateIllustrativeImage = async (query: string): Promise<string | null> => {
  const ai = getAi();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A professional, high-quality, cinematic 3D illustration of a local business category: ${query}. Modern, clean, professional lighting, centered composition.` }]
      },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image gen error", e);
    return null;
  }
};

/**
 * Starts a chat session with the AI Assistant.
 */
export const startAssistantChat = (): Chat => {
  const ai = getAi();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Eres Scout AI, un asistente experto en análisis de mercado local y estrategia digital. Ayudas a los usuarios a entender el valor de tener un sitio web y cómo identificar oportunidades de digitalización en comercios locales.',
    },
  });
};
