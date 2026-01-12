import { Property } from '../types';

export const geminiService = {
  async auditProperties(properties: Property[]): Promise<{ id: string; reason: string }[]> {
    try {
      return properties
        .filter(p => p.status === 'Review' || p.title.toLowerCase().includes('copia'))
        .map(p => ({
          id: p.id,
          reason: "Análisis de consistencia para LeRoy Residence."
        }));
    } catch (error) {
      return [];
    }
  }
};
