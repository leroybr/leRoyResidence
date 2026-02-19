
import React, { useState, useEffect } from 'react';
import { Property, SearchFilters } from '../types';
import PropertyCard from './PropertyCard';
import Sidebar from './Sidebar';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onClearFilters: () => void;
  onPropertyClick: (id: string) => void;
  onGoHome: () => void;
}

const ListingView: React.FC<ListingViewProps> = ({ category, properties, onClearFilters, onPropertyClick, onGoHome }) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>({});
  const [filteredProps, setFilteredProps] = useState<Property[]>(properties);

  useEffect(() => {
    let result = [...properties];
    if (localFilters.location) result = result.filter(p => p.location.includes(localFilters.location!));
    if (localFilters.propertyType) result = result.filter(p => p.type === localFilters.propertyType);
    if (localFilters.minBedrooms) result = result.filter(p => p.bedrooms >= localFilters.minBedrooms!);
    if (localFilters.minPrice) result = result.filter(p => p.price >= localFilters.minPrice!);
    if (localFilters.maxPrice) result = result.filter(p => p.price <= localFilters.maxPrice!);
    if (localFilters.listingType) result = result.filter(p => p.listingType === localFilters.listingType);
    setFilteredProps(result);
  }, [localFilters, properties]);

  return (
    <div className="pt-40 md:pt-48 pb-20 min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        
        <div className="mb-16">
          <nav className="flex text-[9px] text-gray-400 mb-6 uppercase tracking-[0.25em] font-bold">
            <span className="hover:text-leroy-orange cursor-pointer transition-colors" onClick={onGoHome}>Home</span>
            <span className="mx-3">/</span>
            <span className="text-leroy-black">{category === 'real_estate' ? 'Bienes Raíces' : category}</span>
          </nav>
          
          <h1 className="font-serif text-5xl md:text-7xl text-leroy-black mb-6">
            {category === 'real_estate' ? 'Luxury Real Estate' : `Propiedades en ${category}`}
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">
            {filteredProps.length} Listados exclusivos disponibles
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          <Sidebar 
            filters={localFilters} 
            onFilterChange={setLocalFilters} 
            onClear={() => setLocalFilters({})} 
          />

          <div className="flex-grow">
            <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-100">
               <div className="flex items-center space-x-8">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ordenar:</span>
                  <select className="text-[10px] font-bold uppercase tracking-widest outline-none bg-transparent cursor-pointer hover:text-leroy-orange transition-colors">
                    <option>Precio (Mayor a Menor)</option>
                    <option>Precio (Menor a Mayor)</option>
                    <option>Más Recientes</option>
                  </select>
               </div>
            </div>

            {filteredProps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {filteredProps.map(property => (
                  <PropertyCard key={property.id} property={property} onClick={onPropertyClick} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-gray-100">
                <p className="font-serif italic text-2xl text-gray-300 mb-8">No se encontraron propiedades que coincidan.</p>
                <button 
                  onClick={() => setLocalFilters({})}
                  className="px-12 py-4 bg-leroy-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-leroy-orange transition-all shadow-xl"
                >
                  Reiniciar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingView;
