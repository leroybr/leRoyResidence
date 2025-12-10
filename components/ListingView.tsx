import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { PropertyCard } from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
  onNavigate: (view: string, category?: string) => void;
}

const UF_VALUE_CLP = 37800;
const USD_VALUE_CLP = 950;
const EUR_VALUE_CLP = 1020;

const ListingView: React.FC<ListingViewProps> = ({ 
  category, 
  properties, 
  onPropertyClick, 
  onGoHome, 
  onClearFilters,
  onNavigate 
}) => {
  const knownCities = ['Concepción', 'Chiguayante', 'San Pedro de la Paz', 'Talcahuano', 'Coronel', 'Penco', 'Los Ángeles'];
  const isCity = knownCities.includes(category);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterBedrooms, setFilterBedrooms] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);

  useEffect(() => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    setShowFilters(false);
  }, [category]);

  useEffect(() => {
    let result = properties;

    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }

    if (filterBedrooms > 0) {
      result = result.filter(p => p.bedrooms >= filterBedrooms);
    }

    if (filterMinPrice || filterMaxPrice) {
      const min = filterMinPrice ? parseInt(filterMinPrice) : 0;
      const max = filterMaxPrice ? parseInt(filterMaxPrice) : Number.MAX_SAFE_INTEGER;

      result = result.filter(p => {
        let priceInCLP = 0;
        const currency = p.currency.trim();
        
        if (currency === 'UF') priceInCLP = p.price * UF_VALUE_CLP;
        else if (currency === '$' || currency === 'USD') priceInCLP = p.price * USD_VALUE_CLP;
        else if (currency === '€') priceInCLP = p.price * EUR_VALUE_CLP;
        else priceInCLP = p.price;

        return priceInCLP >= min && priceInCLP <= max;
      });
    }

    setFilteredProperties(result);
  }, [properties, filterMinPrice, filterMaxPrice, filterBedrooms, filterType]);

  const handleClearLocalFilters = () => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    onClearFilters(); 
  };
  
  let title = category;
  
  if (isCity) {
    title = `Inmuebles en ${category}`;
  } else if (category === 'Bienes Raíces') {
    title = 'Inmuebles en Concepción';
  } else if (category === 'Show room Cocinas') {
    title = 'Nuevas tecnologías en la Cocina';
  } else if (category === 'Desarrollos') {
    title = 'Nuevos Desarrollos';
  } else if (category === 'Premium Property') {
    title = 'Propiedades Premium';
  } else if (category.includes('Dorm') || category.includes('Precio')) {
      title = `Resultados: ${category}`;
  } else if (!category || category === 'Resultados de Búsqueda') {
    title = 'Resultados de Búsqueda';
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-4">
          <button 
            onClick={onGoHome}
            className="flex items-center text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver a Inicio
          </button>
        </div>

        <div className="mb-6">
           <h1 className="font-serif text-3xl md:text-4xl text-black capitalize tracking-tight leading-none">
             {title}
           </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-black text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Filtros
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {showFilters && (
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
                   <h3 className="font-serif text-base text-black">Filtrar por</h3>
                   <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-black">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                   </button>
                </div>
                
                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase text-black mb-2 tracking-widest">Precio (CLP)</label>
                  <div className="space-y-3">
                    <input 
                      type="number" 
                      placeholder="Mínimo" 
                      value={filterMinPrice}
                      onChange={(e) => setFilterMinPrice(e.target.value)}
                      className="w-full text-sm border-gray-300 rounded-md focus:border-black focus:ring-0 p-2.5 bg-white placeholder-gray-400 text-black"
                    />
                    <input 
                      type="number" 
                      placeholder="Máximo" 
                      value={filterMaxPrice}
                      onChange={(e) => setFilterMaxPrice(e.target.value)}
                      className="w-full text-sm border-gray-300 rounded-md focus:border-black focus:ring-0 p-2.5 bg-white placeholder-gray-400 text-black"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase text-black mb-2 tracking-widest">Dormitorios</label>
                  <select 
                    value={filterBedrooms}
                    onChange={(e) => setFilterBedrooms(Number(e.target.value))}
                    className="w-full text-sm border-gray-300 rounded-md focus:border-black focus:ring-0 p-2.5 bg-white text-black"
                  >
                    <option value={0}>Cualquiera</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5+</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold uppercase text-black mb-2 tracking-widest">Tipo de Propiedad</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md focus:border-black focus:ring-0 p-2.5 bg-white text-black"
                  >
                    <option value="all">Todos</option>
                    {Object.values(PropertyType).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleClearLocalFilters}
                  className="w-full bg-gray-100 border border-transparent text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-md"
                >
                  Limpiar Filtros
                </button>
              </div>
            </aside>
          )}

          <div className="flex-1">
            {filteredProperties.length > 0 ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3'} gap-x-6 gap-y-12`}>
                {filteredProperties.map(property => (
                  <div key={property.id} className="h-full">
                    <PropertyCard property={property} onClick={() => onPropertyClick(property)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-lg flex flex-col justify-center items-center">
                <div className="inline-block p-4 rounded-full bg-white mb-4 shadow-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                   </svg>
                </div>
                <h3 className="font-serif text-lg text-black mb-2">No se encontraron resultados</h3>
                <p className="text-gray-500 mb-6 text-xs">Intenta ajustar los filtros.</p>
                <button 
                  onClick={handleClearLocalFilters}
                  className="border border-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-black rounded"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
        
        {filteredProperties.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100">
             <h2 className="font-serif text-xl text-black mb-4">Sobre esta colección</h2>
             <p className="text-gray-600 text-sm leading-relaxed max-w-4xl columns-1 md:columns-2 gap-12 font-light">
               Descubra las mejores propiedades en {category === 'Premium Property' ? 'nuestra colección Premium' : category}. 
               Nuestra colección incluye desde modernas villas hasta penthouses históricos, todos seleccionados rigurosamente 
               para satisfacer los estándares más altos. LeRoy Residence es su socio confiable en el mercado inmobiliario.
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListingView;
