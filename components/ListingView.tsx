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
  onNavigate, // Used in empty state to navigate back
}) => {
  // --- Local Filter State ---
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterBedrooms, setFilterBedrooms] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Reset local filters when category changes
  useEffect(() => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    setIsFiltersOpen(false);
  }, [category]);

  // Apply filters logic
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

  // --- Title Logic ---
  let title = category;
  const knownCities = ['Concepción', 'Chiguayante', 'San Pedro de la Paz', 'Talcahuano', 'Coronel', 'Penco', 'Los Ángeles'];
  
  if (knownCities.includes(category)) {
    title = `Propiedades de lujo en ${category}`;
  } else if (category === 'Bienes Raíces') {
    title = 'Propiedades Exclusivas en Venta';
  } else if (category === 'Premium Property') {
    title = 'Colección Premium';
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
          <button onClick={onGoHome} className="hover:text-leroy-black transition-colors">Inicio</button>
          <span className="mx-2">/</span>
          <span className="text-leroy-black">{category}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="font-serif text-3xl md:text-5xl text-leroy-black mb-4">
              {title}
            </h1>
            <p className="text-gray-500 font-light max-w-2xl text-sm md:text-base">
               Explora nuestra selección curada de las propiedades más extraordinarias. 
               {filteredProperties.length} resultados encontrados.
            </p>
        </div>

        {/* JamesEdition Style Filters Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-y border-gray-100 py-4 mb-10 -mx-4 px-4 md:mx-0 md:px-0">
           <div className="flex flex-wrap items-center gap-4 justify-between">
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                 {/* Type Filter */}
                 <div className="relative group">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-leroy-gold hover:border-gray-300 cursor-pointer min-w-[140px]"
                    >
                        <option value="all">Tipo: Todos</option>
                        {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>

                 {/* Bedrooms Filter */}
                 <div className="relative group">
                    <select 
                        value={filterBedrooms}
                        onChange={(e) => setFilterBedrooms(Number(e.target.value))}
                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-leroy-gold hover:border-gray-300 cursor-pointer min-w-[140px]"
                    >
                        <option value={0}>Dormitorios: Todos</option>
                        <option value={1}>1+</option>
                        <option value={2}>2+</option>
                        <option value={3}>3+</option>
                        <option value={4}>4+</option>
                        <option value={5}>5+</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>

                 {/* Price Filter Toggle (Simple logic for UI) */}
                 <button 
                   onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                   className={`border border-gray-200 py-2 px-4 rounded text-xs font-bold uppercase tracking-widest hover:border-leroy-gold transition-colors ${filterMinPrice || filterMaxPrice ? 'bg-gray-100 border-gray-300' : 'bg-gray-50'}`}
                 >
                   Precio {filterMinPrice || filterMaxPrice ? '(Activo)' : ''}
                 </button>

                 <button 
                   onClick={handleClearLocalFilters}
                   className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-black underline decoration-gray-300 underline-offset-4 ml-2"
                 >
                   Limpiar
                 </button>
              </div>

              {/* View/Sort Options (Visual mostly) */}
              <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Ordenar por:</span>
                  <select className="bg-transparent border-none p-0 text-leroy-black font-bold uppercase tracking-widest focus:ring-0 cursor-pointer">
                      <option>Relevancia</option>
                      <option>Precio: Menor a Mayor</option>
                      <option>Precio: Mayor a Menor</option>
                      <option>Más Recientes</option>
                  </select>
              </div>
           </div>

           {/* Expandable Price Filter Area */}
           {isFiltersOpen && (
             <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl p-6 rounded w-full md:w-80 z-50 animate-in slide-in-from-top-2">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Rango de Precio (CLP)</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 block mb-1">Mínimo</label>
                        <input 
                            type="number" 
                            value={filterMinPrice}
                            onChange={(e) => setFilterMinPrice(e.target.value)}
                            className="w-full border-gray-200 bg-gray-50 p-2 rounded text-sm"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 block mb-1">Máximo</label>
                        <input 
                            type="number" 
                            value={filterMaxPrice}
                            onChange={(e) => setFilterMaxPrice(e.target.value)}
                            className="w-full border-gray-200 bg-gray-50 p-2 rounded text-sm"
                            placeholder="Sin límite"
                        />
                    </div>
                    <button 
                        onClick={() => setIsFiltersOpen(false)}
                        className="w-full bg-leroy-black text-white py-2 rounded text-xs font-bold uppercase tracking-widest mt-2"
                    >
                        Aplicar
                    </button>
                </div>
             </div>
           )}
        </div>

        {/* Results Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => onPropertyClick(property)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
             <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
             </div>
             <h3 className="font-serif text-xl text-gray-900 mb-2">Sin resultados</h3>
             <p className="text-gray-500 text-sm mb-6">No encontramos propiedades que coincidan con tus filtros.</p>
             <button 
               onClick={handleClearLocalFilters}
               className="text-leroy-gold font-bold uppercase text-xs tracking-widest border-b border-leroy-gold pb-1 hover:text-leroy-black hover:border-leroy-black transition-colors"
             >
               Ver todas las propiedades
             </button>
          </div>
        )}

        {/* Pagination / Footer Note */}
        {filteredProperties.length > 0 && (
            <div className="mt-20 flex flex-col items-center justify-center border-t border-gray-100 pt-10">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                    Mostrando {filteredProperties.length} de {properties.length} propiedades
                </p>
                {/* Visual Pagination */}
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-leroy-black text-white text-xs font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-colors">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-colors">3</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ListingView;
