import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
  // 💡 CORRECCIÓN para TS2322: Se añade 'onNavigate'
  onNavigate: (view: string, category?: string) => void;
}

const ListingView: React.FC<ListingViewProps> = ({
  category,
  properties,
  onPropertyClick,
  onGoHome,
  onClearFilters,
  onNavigate, // Se desestructura la nueva prop
}) => {
  return (
    <div className="w-full pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-0 flex flex-col gap-6">

        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{category}</h2>

          <div className="flex gap-3">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Limpiar filtros
            </button>

            <button
              onClick={onGoHome}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Inicio
            </button>
          </div>
        </div>

        {properties.length === 0 ? (
           <div className="py-20 text-center text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
               </svg>
               <h3 className="text-xl font-semibold mb-2 text-leroy-black">No se encontraron propiedades</h3>
               <p>Intenta ajustar tus filtros de búsqueda o <button onClick={() => onNavigate('listing', 'Bienes Raíces')} className="text-blue-600 hover:underline">ver toda la cartera</button>.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onClick={() => onPropertyClick(prop)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingView;
