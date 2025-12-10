import React, { useState, useEffect } from 'react';

// =========================================================
// 1. INTERFACES NECESARIAS
// =========================================================

/**
 * Define la estructura de datos de una propiedad. 
 * Las propiedades opcionales se marcan con '?'.
 */
interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    description?: string; 
    amenities?: string[]; 
    isPremium?: boolean;  
    imageUrl: string;
    // Añade aquí todas las demás propiedades de tu objeto Property
}

/**
 * Define las props que recibe el componente PropertyCardDetailView.
 * 'property' se marca como opcional (property?: Property) ya que puede ser 'undefined' 
 * mientras los datos están cargando.
 */
interface PropertyCardDetailViewProps {
    property?: Property;
}

// =========================================================
// 2. COMPONENTE CORREGIDO Y TIPADO
// =========================================================

const PropertyCardDetailView: React.FC<PropertyCardDetailViewProps> = ({ property }) => {
    
    // Estados que esperan un valor definido (string, string[], boolean, etc.)
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [area, setArea] = useState<number | undefined>(undefined);
    const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
    const [isPremium, setIsPremium] = useState(false);

    // useEffect para cargar los datos en los estados
    useEffect(() => {
        // La verificación `if (property)` asegura que no accedemos a propiedades de 'undefined'.
        if (property) {
            
            // --- CORRECCIONES TS2345 (SetStateAction) ---
            
            // Si 'property.title' fuera opcional, usaríamos '??'
            setTitle(property.title); // Asumiendo que 'title' es requerido en la interfaz
            
            // 1. Corrección para 'description' (string): Si es undefined, usa un fallback
            setDescription(property.description ?? 'No hay descripción detallada disponible.');
            
            // 2. Corrección para 'amenities' (string[]): Si es undefined, usa un arreglo vacío.
            setAmenitiesList(property.amenities ?? []);
            
            // 3. Corrección para 'isPremium' (boolean): Si es undefined, usa 'false'.
            setIsPremium(property.isPremium ?? false);
            
            // Para números opcionales, asigna directamente 'undefined' o un valor por defecto
            setArea(property.area);
        }
    }, [property]);

    // Renderizado del componente
    return (
        <div className="property-details-view p-6 bg-white shadow-lg rounded-lg">
            {!property ? (
                <div className="text-center text-gray-500">Cargando detalles de la propiedad...</div>
            ) : (
                <>
                    <header className="mb-6 border-b pb-4">
                        <h1 className="text-4xl font-serif text-leroy-black">{title}</h1>
                        <p className="text-xl text-gray-600 mt-1">{property.location}</p>
                        {isPremium && (
                            <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                ⭐️ Propiedad Premium
                            </span>
                        )}
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-lg">
                            <span className="font-bold block">Precio:</span> 
                            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(property.price)}
                        </div>
                        <div className="text-lg">
                            <span className="font-bold block">Dormitorios:</span> 
                            {property.bedrooms ?? 'N/A'}
                        </div>
                        <div className="text-lg">
                            <span className="font-bold block">Superficie:</span> 
                            {area ? `${area} m²` : 'N/A'}
                        </div>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-3 border-b pb-1">Descripción</h2>
                        <p className="whitespace-pre-wrap text-gray-700">{description}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold mb-3 border-b pb-1">Amenidades</h2>
                        {amenitiesList.length > 0 ? (
                            <ul className="list-disc list-inside ml-4 text-gray-700 grid grid-cols-2 gap-2">
                                {amenitiesList.map((amenity, index) => (
                                    <li key={index}>{amenity}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No se han listado amenidades específicas.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default PropertyCardDetailView;
