// pages/api/properties.ts

import { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';
import { Property } from '../../types'; // Ajusta la ruta si tu archivo 'types' no está en la raíz
import { v4 as uuidv4 } from 'uuid'; 

// --- Configuración de la Ruta del Archivo de "Base de Datos" ---
// Esto apunta al archivo 'data/properties.json' que debe estar en la raíz del proyecto.
const PROPERTIES_FILE_PATH = path.join(process.cwd(), 'data', 'properties.json');

// --- Funciones de Utilidad (Lectura/Escritura) ---

const readProperties = (): Property[] => {
  try {
    const fileContent = fs.readFileSync(PROPERTIES_FILE_PATH, 'utf-8');
    // Si el archivo está vacío (por ejemplo, después de crearlo), JSON.parse podría fallar, así que lo manejamos.
    if (!fileContent) return []; 
    return JSON.parse(fileContent) as Property[];
  } catch (error) {
    // Retorna array vacío si el archivo no existe, lo cual es normal la primera vez.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
    }
    console.error("Error leyendo properties.json:", error);
    return [];
  }
};

const writeProperties = (properties: Property[]): void => {
  // Asegurar que el directorio 'data' exista
  const dir = path.dirname(PROPERTIES_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Escribir el array de propiedades formateado
  fs.writeFileSync(PROPERTIES_FILE_PATH, JSON.stringify(properties, null, 2), 'utf-8');
};


// --- Controlador API (Handler) ---

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let properties = readProperties();
    
    switch (req.method) {
      
      case 'GET':
        // Cargar todas las propiedades para el frontend (AdminView y ListingView)
        return res.status(200).json(properties);

      case 'POST':
        // Añadir una nueva propiedad
        const newPropertyData = req.body as Property;
        
        const newProperty: Property = {
          ...newPropertyData,
          id: uuidv4(), // Generar un ID único
          isPublished: newPropertyData.isPublished || false, 
        };

        properties.unshift(newProperty); 
        writeProperties(properties);
        return res.status(201).json(newProperty);

      case 'PUT':
        // Actualizar una propiedad existente
        const updatedData = req.body as Property;
        const index = properties.findIndex(p => p.id === updatedData.id);
        
        if (index === -1) {
          return res.status(404).json({ message: 'Propiedad no encontrada para actualizar' });
        }
        
        properties[index] = updatedData; 
        writeProperties(properties);
        return res.status(200).json(updatedData);

      case 'DELETE':
        // Eliminar una propiedad
        const propertyIdToDelete = req.query.id as string;
        const filteredProperties = properties.filter(p => p.id !== propertyIdToDelete);
        
        if (filteredProperties.length === properties.length) {
          return res.status(404).json({ message: 'Propiedad no encontrada para eliminar' });
        }
        
        properties = filteredProperties;
        writeProperties(properties);
        return res.status(200).json({ message: 'Propiedad eliminada con éxito' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
  } catch (error) {
    console.error('Error en la API de propiedades:', error);
    return res.status(500).json({ message: 'Error interno del servidor al manipular el archivo de datos.' });
  }
}
