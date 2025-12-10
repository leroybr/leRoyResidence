import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Property, HeroSearchState } from '../types';

// Definición de la interfaz Props, incluyendo la prop faltante 'searchFilters'
interface ListingViewProps {
  properties: Property[];
  category: string;
  searchFilters: HeroSearchState | null; // <--- CORREGIDO: Propiedad requerida por App.tsx
  onPropertyClick: (property: Property) => void;
}

const ListingView: React.FC<ListingViewProps> = ({ 
    properties, 
    category, 
    searchFilters, 
    onPropertyClick 
}) => {

  const title = category === 'Resultados de Búsqueda' 
    ? 'Resultados de tu Búsqueda'
    : `Listado de Propiedades en ${category}`;

  const subtitle = properties.length > 0
    ? `${properties.length} ${properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}.`
    : `No se encontraron propiedades para la categoría o filtros seleccionados.`;

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de la Vista */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-serif text-leroy-black mb-2">{title}</h1>
          <p className="text-gray-600 text-lg">{subtitle}</p>

          {/* Mostrar filtros si existen */}
          {searchFilters && category === 'Resultados de Búsqueda' && (
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg inline-block text-sm text-gray-700 shadow-sm">
                Filtros: 
                <span className="font-semibold ml-2">Ubicación: </span>{searchFilters.location || 'Cualquiera'},
                <span className="font-semibold ml-2">Dormitorios: </span>{searchFilters.bedrooms !== 'any' ? `${searchFilters.bedrooms}+` : 'Cualquiera'},
                <span className="font-semibold ml-2">Precio: </span>{searchFilters.priceRange !== 'any' ? searchFilters.priceRange : 'Cualquiera'}
            </div>
          )}
        </header>

        {/* Lista de Propiedades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onClick={() => onPropertyClick(property)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingView;
