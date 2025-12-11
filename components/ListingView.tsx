import React, { useState, useEffect } from 'react';
import { Property, PropertyType, HeroSearchState } from '../types'; // Importar HeroSearchState
import { PropertyCard } from './PropertyCard';
import { COMMUNES } from '../constants';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
  
  // 👈 AÑADIDO: Propiedades que faltaban
  onNavigate: (view: string, category?: string) => void;
  searchFilters: HeroSearchState;
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
  // 👈 DESESTRUCTURAR LA NUEVA PROP
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

  // --- EFECTO para aplicar filtros iniciales (de Hero) ---
  useEffect(() => {
	// Aplicar filtros iniciales solo la primera vez si provienen de la búsqueda en Hero
	if (searchFilters.priceRange !== 'any') {
		const [min, max] = searchFilters.priceRange.split('-').map(val => (val === 'plus' ? String(Number.MAX_SAFE_INTEGER) : val));
		setFilterMinPrice(min || '');
		setFilterMaxPrice(max || '');
	}
	if (searchFilters.bedrooms !== 'any' && searchFilters.bedrooms.endsWith('+')) {
		setFilterBedrooms(parseInt(searchFilters.bedrooms) || 0);
	}
  }, [searchFilters]);


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

    // 1. Filtrar por Tipo
    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }

    // 2. Filtrar por Dormitorios
    if (filterBedrooms > 0) {
      result = result.filter(p => p.bedrooms >= filterBedrooms);
    }
    
    // 3. Filtrar por Ubicación (desde HeroSearchState)
    if (searchFilters.location && searchFilters.location !== 'Cualquiera') {
        result = result.filter(p => p.location.toLowerCase().includes(searchFilters.location.toLowerCase()));
    }

    // 4. Filtrar por Precio
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
  }, [properties, filterMinPrice, filterMaxPrice, filterBedrooms, filterType, searchFilters]); // Dependencia searchFilters añadida para re-filtrar

  const handleClearLocalFilters = () => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    onClearFilters(); 
  };

  // --- Title Logic ---
  let title = category;
  
  if (COMMUNES.includes(category)) {
    title = `Explora propiedades en ${category}`;
  } else if (category === 'Bienes Raíces') {
    title = 'Propiedades en Venta';
  } else if (category === 'Premium Property') {
    title = 'Colección Premium';
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
          {/* 👈 USANDO onNavigate para corregir el error TS6133 (declarada pero no usada) */}
          <button onClick={() => onNavigate('home')} className="hover:text-leroy-black transition-colors">Inicio</button> 
          <span className="mx-2">/</span>
          <span className="text-leroy-black">{category}</span>
        </nav>

        {/* Header - Aligned with JE: Title Left, Sort/Actions Right usually */}
        <div className="mb-6 flex flex-col md:flex-row md:items-baseline md:justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-leroy-black mb-2">
                {title}
              </h1>
              <p className="text-gray-500 font-light text-sm">
                 {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 hidden md:block">
               {/* Sort Placeholder */}
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Ordenar:</span>
                  <select className="bg-transparent border-none text-black font-bold focus:ring-0 cursor-pointer p-0">
                    <option>Relevancia</option>
                    <option>Precio: Menor</option>
                    <option>Precio: Mayor</option>
                    <option>Más Reciente</option>
                  </select>
               </div>
            </div>
        </div>

        {/* Filter Bar - JamesEdition Style: Rectangular, Bordered, Sticky */}
        <div className="sticky top-[75px] z-30 bg-white border-y border-gray-200 py-3 mb-8 -mx-4 px-4 md:mx-0 md:px-0 shadow-sm transition-all">
           <div className="flex flex-wrap items-center justify-between gap-4">
              
              {/* Left: Filters */}
              <div className="flex flex-wrap items-center gap-2">
                 
                 {/* Type Filter */}
                 <div className="relative group">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 text-xs font-bold uppercase tracking-widest hover:border-black focus:outline-none focus:border-black transition-colors cursor-pointer min-w-[140px] rounded-sm"
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
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 text-xs font-bold uppercase tracking-widest hover:border-black focus:outline-none focus:border-black transition-colors cursor-pointer min-w-[140px] rounded-sm"
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
                        className={`border py-2.5 px-4 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors bg-white flex items-center gap-2 rounded-sm ${filterMinPrice || filterMaxPrice ? 'border-black text-black' : 'border-gray-300 text-gray-700'}`}
                    >
                        Precio {filterMinPrice || filterMaxPrice ? '*' : ''}
                        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </button>
                    
                    {/* Price Dropdown */}
                    {isFiltersOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl p-6 w-72 z-50 animate-in slide-in-from-top-2 rounded-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Rango de Precio (CLP)</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-1">Mínimo</label>
                                    <input 
                                        type="number" 
                                        value={filterMinPrice}
                                        onChange={(e) => setFilterMinPrice(e.target.value)}
                                        className="w-full border-gray-300 bg-white p-2 text-sm focus:border-black focus:ring-0 rounded-sm"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 block mb-1">Máximo</label>
                                    <input 
                                        type="number" 
                                        value={filterMaxPrice}
                                        onChange={(e) => setFilterMaxPrice(e.target.value)}
                                        className="w-full border-gray-300 bg-white p-2 text-sm focus:border-black focus:ring-0 rounded-sm"
                                        placeholder="Sin límite"
                                    />
                                </div>
                                <button 
                                    onClick={() => setIsFiltersOpen(false)}
                                    className="w-full bg-leroy-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 rounded-sm"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    )}
                 </div>

                 <button 
                   onClick={handleClearLocalFilters}
                   className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-black underline decoration-gray-300 underline-offset-4 ml-2"
                 >
                   Limpiar
                 </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  
                  {/* Map Toggle */}
                  <div className="flex border border-gray-300 bg-white rounded-sm overflow-hidden">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-black shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        Lista
                      </button>
                      <button 
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${viewMode === 'map' ? 'bg-gray-100 text-black shadow-inner' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        Mapa
                      </button>
                  </div>

                  {/* Save Search */}
                  <button className="hidden md:flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors rounded-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                      </svg>
                      Guardar Búsqueda
                  </button>
              </div>
           </div>
        </div>

        {/* Content Area */}
        {viewMode === 'map' ? (
           <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center border border-gray-200">
               <div className="text-center">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0Z" />
                   </svg>
                   <p className="text-gray-500 font-sans">Vista de mapa próximamente</p>
               </div>
           </div>
        ) : (
            <>
                {/* Results Grid - JE uses 3 columns mostly on desktop, 4 on XL */}
                {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
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
                    className="text-leroy-black font-bold uppercase text-xs tracking-widest border-b border-leroy-black pb-1 hover:text-leroy-gold hover:border-leroy-gold transition-colors"
                    >
                    Ver todas las propiedades
                    </button>
                </div>
                )}

                {/* Pagination */}
                {filteredProperties.length > 0 && (
                    <div className="mt-20 flex items-center justify-between border-t border-gray-100 pt-8">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Mostrando {filteredProperties.length} propiedades
                        </span>
                        <div className="flex gap-1">
                            <button className="w-10 h-10 flex items-center justify-center border border-black bg-black text-white text-xs font-bold hover:opacity-80 transition-opacity">1</button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-500 text-xs font-bold hover:border-gray-400 transition-colors">2</button>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-500 text-xs font-bold hover:border-gray-400 transition-colors">3</button>
                            <span className="flex items-center justify-center w-10 text-gray-400">...</span>
                            <button className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-white text-gray-500 text-xs font-bold hover:border-gray-400 transition-colors">Next</button>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default ListingView;
