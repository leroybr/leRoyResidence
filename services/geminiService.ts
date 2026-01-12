
import { GoogleGenAI, Type } from "@google/genai";
import { Property } from "../types";

export class GeminiService {
  async auditProperties(properties: Property[]): Promise<{id: string, reason: string}[]> {
    // Inicialización según las guías: objeto con propiedad apiKey dentro de la llamada
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Actúa como un auditor experto de LeroyResidence. Analiza el siguiente listado y detecta propiedades que no deberían estar:
    1. Duplicados (títulos o ubicaciones idénticas).
    2. Errores de precio (precios absurdamente bajos o altos para el mercado).
    3. Registros de prueba o incompletos.
    
    Devuelve un JSON con un array de objetos con el ID y la razón.
    
    Listado: ${JSON.stringify(properties.map(p => ({
      id: p.id, 
      title: p.title, 
      price: p.price, 
      location: p.location,
      desc: p.description
    })))}`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              flags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: {
                      type: Type.STRING,
                      description: 'ID único de la propiedad marcada.',
                    },
                    reason: {
                      type: Type.STRING,
                      description: 'Explicación de por qué debe ser revisada o eliminada.',
                    },
                  },
                  propertyOrdering: ["id", "reason"],
                },
              },
            },
            propertyOrdering: ["flags"],
          },
        },
      });
      
      const text = response.text;
      if (!text) return [];
      
      const result = JSON.parse(text);
      return result.flags || [];
    } catch (error) {
      console.error("Error en Auditoría LeroyResidence:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
