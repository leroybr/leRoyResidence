import React from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
}

const ListingView: React.FC<ListingViewProps> = ({
  category,
  properties,
  onPropertyClick,
  onGoHome,
  onClearFilters,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onClick={() => onPropertyClick(prop)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingView;
