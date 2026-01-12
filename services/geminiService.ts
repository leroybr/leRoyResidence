import { Property } from '../types';

// Usamos "export const" para que coincida con la importación en App.tsx
export const geminiService = {
  async auditProperties(properties: Property[]): Promise<{ id: string; reason: string }[]> {
    try {
      // Esta es la lógica que hace funcionar el botón "Escanear IA"
      return properties
        .filter(p => p.status === 'Review' || p.title.toLowerCase().includes('copia'))
        .map(p => ({
          id: p.id,
          reason: "Detección de duplicidad o datos inconsistentes en el registro."
        }));
    } catch (error) {
      console.error("Error en el servicio de auditoría:", error);
      return [];
    }
  }
};
