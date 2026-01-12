import { Property } from '../types';

// Exportamos como constante (no como clase) para que App.tsx lo reconozca
export const geminiService = {
  async auditProperties(properties: Property[]): Promise<{ id: string; reason: string }[]> {
    try {
      // Esta lógica detecta copias o errores para tu limpieza rápida
      return properties
        .filter(p => p.status === 'Review' || p.title.toLowerCase().includes('copia'))
        .map(p => ({
          id: p.id,
          reason: "Detección de duplicidad o datos inconsistentes en el registro de LeRoy."
        }));
    } catch (error) {
      console.error("Error en el servicio de auditoría:", error);
      return [];
    }
  }
};
