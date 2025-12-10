// ListingView.tsx

import React, { useState, useEffect } from 'react';
import { Property, PropertyType, HeroSearchState } from '../types'; // Importar HeroSearchState
import { PropertyCard } from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
  onNavigate: (view: string, category?: string) => void;
  // Se espera esta prop de App.tsx para mostrar resultados de búsqueda iniciales
  searchFilters: HeroSearchState | null; 
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
  onNavigate,
  searchFilters,
}) => {
  // --- Local Filter State ---
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterBedrooms, setFilterBedrooms] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Reset local filters when category changes or a new search is initiated
  useEffect(() => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    setIsFiltersOpen(false);
    
    // BONUS: Si App.tsx ya aplicó filtros (searchFilters), re-ejecutamos el filtro local
    // ya que el useEffect de filtrado depende de `searchFilters`.
    // No es necesario establecer el estado aquí porque el useEffect de abajo se encarga.
    
  }, [category, searchFilters]); // Dependencia de searchFilters

  // Apply filters logic
  useEffect(() => {
    let result = properties;

    // 1. Filtro local por Tipo
    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }

    // 2. Filtro local por Dormitorios
    if (filterBedrooms > 0) {
      result = result.filter(p => p.bedrooms >= filterBedrooms);
    }

    // 3. Filtro local por Precio (si se aplica localmente, el filtro global de App.tsx ya actuó sobre `properties`)
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
    // searchFilters se mantiene como dependencia para que el filtro se re-ejecute
    // cuando App.tsx pasa una nueva lista de `properties` después de una búsqueda Hero.
  }, [properties, filterMinPrice, filterMaxPrice, filterBedrooms, filterType, searchFilters]); 

  const handleClearLocalFilters = () => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    // Llama a la función en App.tsx para limpiar los filtros globales si los hay
    // y forzar la recarga de la lista completa (a través del cambio de `properties`).
    if (searchFilters) {
      onClearFilters(); // Esto reinicia searchFilters en App.tsx
    }
  };

  // --- Title Logic ---
  let title = category;
  const knownCities = ['Concepción', 'Chiguayante', 'San Pedro de la Paz', 'Talcahuano', 'Coronel', 'Penco', 'Los Ángeles'];
  
  if (knownCities.includes(category)) {
    title = `Propiedades en ${category}`;
  } else if (category === 'Bienes Raíces') {
    title = 'Propiedades en Venta';
  } else if (category === 'Premium Property') {
    title = 'Colección Premium';
  } else if (category === 'Resultados de Búsqueda') { // Si viene de una búsqueda de Hero
    title = 'Resultados de Búsqueda';
  }


  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
          <button onClick={onGoHome} className="hover:text-leroy-black transition-colors">Inicio</button>
          <span className="mx-2">/</span>
          <span className="text-leroy-black">{title}</span>
        </nav>

        {/* Header - Title and Count */}
        <div className="mb-6">
            <h1 className="font-serif text-3xl text-leroy-black mb-2">
              {title}
            </h1>
            <p className="text-gray-500 font-light text-sm">
               {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
        </div>

        {/* Filter Bar - Sticky */}
        <div className="sticky top-[70px] z-30 bg-white border-y border-gray-200 py-3 mb-8 -mx-4 px-4 md:mx-0 md:px-0 shadow-sm">
           <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Left: Filters */}
              <div className="flex flex-wrap items-center gap-2">
                 
                 {/* Type Filter */}
                 <div className="relative group">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 text-xs font-bold uppercase tracking-widest hover:border-gray-800 focus:outline-none focus:border-leroy-black transition-colors cursor-pointer min-w-[140px]"
                    >
                        <option value="all">Tipo: Todos</option>
                        {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>

                 {/* Bedrooms Filter */}
                 <div className="relative group">
                    <select 
                        value={filterBedrooms}
                        onChange={(e) => setFilterBedrooms(Number(e.target.value))}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 text-xs font-bold uppercase tracking-widest hover:border-gray-800 focus:outline-none focus:border-leroy-black transition-colors cursor-pointer min-w-[140px]"
                    >
                        <option value={0}>Dormitorios</option>
                        <option value={1}>1+</option>
                        <option value={2}>2+</option>
                        <option value={3}>3+</option>
                        <option value={4}>4+</option>
                        <option value={5}>5+</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                 </div>

                 {/* Price Filter Button */}
                 <div className="relative">
                    <button 
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={`border py-2 px-4 text-xs font-bold uppercase tracking-widest hover:border-gray-800 transition-colors bg-white flex items-center gap-2 ${filterMinPrice || filterMaxPrice ? 'border-leroy-black text-leroy-black' : 'border-gray-300 text-gray-700'}`}
                    >
                        Precio {filterMinPrice || filterMaxPrice ? '*' : ''}
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </button>
                    
                    {/* Price Dropdown */}
                    {isFiltersOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl p-6 w-72 z-50 animate-in slide-in-from-top-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Rango de Precio (CLP)</h3>
                            <div className="space-y-4">
