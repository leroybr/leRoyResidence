
import React from 'react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onClearFilters: () => void;
  onPropertyClick: (id: string) => void;
  onGoHome: () => void;
}

const ListingView: React.FC<ListingViewProps> = ({ category, properties, onClearFilters, onPropertyClick, onGoHome }) => {
  // Determine display title logic
  // If the category is one of the known IDs or Cities, we format it.
  // If it's a search result string (e.g. "Concepción, 3+ Dorm"), we use it directly.
  
  const knownCities = ['Concepción', 'Chiguayante', 'San Pedro de la Paz', 'Talcahuano', 'Coronel', 'Penco', 'Los Ángeles'];
  const isCity = knownCities.includes(category);
  
  let title = category;
  let subtitle = `Explora nuestra selección exclusiva. ${properties.length} propiedades encontradas.`;

  if (isCity) {
    title = `Inmuebles de lujo en ${category}`;
  } else if (category === 'real_estate') {
    title = 'Bienes Raíces de Lujo';
  } else if (category === 'showroom_kitchens') {
    title = 'Nuevas tecnologías en la Cocina ¡¡';
    subtitle = 'Innovación, diseño de vanguardia y funcionalidad para el corazón del hogar.';
  } else if (category === 'developments') {
    title = 'Nuevos Desarrollos';
  } else if (category === 'premium') {
    title = 'Propiedades Premium';
  } else if (category.includes('Dorm') || category.includes('Precio')) {
     // It's a complex search title, keep it as is
     title = `Resultados: ${category}`;
  } else if (!category || category === 'Búsqueda Filtrada') {
     title = 'Resultados de Búsqueda';
  }

  return (
    <div className="pt-40 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Return Button */}
        <div className="mb-8">
          <button 
            onClick={onGoHome}
            className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver a Inicio
          </button>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex text-xs text-gray-400 mb-6 uppercase tracking-wider">
          <span className="hover:text-leroy-black cursor-pointer" onClick={onGoHome}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-leroy-black font-semibold truncate max-w-xs">{category === 'premium' ? 'Premium' : category}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-8 mb-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-leroy-black mb-4 capitalize">
              {title}
            </h1>
            <p className="text-gray-500 font-light max-w-2xl">
              {subtitle}
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <div className="relative group">
               <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-4 py-2 hover:border-black transition-colors">
                 <span>Ordenar por</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                 </svg>
               </button>
            </div>
            {properties.length === 0 && (
              <button 
                onClick={onClearFilters}
                className="text-xs text-red-500 font-bold uppercase tracking-widest hover:underline"
              >
                Ver todo
              </button>
            )}
          </div>
        </div>

        {/* Property Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {properties.map(property => (
              <div key={property.id} className="h-full">
                <PropertyCard property={property} onClick={onPropertyClick} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-lg border border-gray-100">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
               </svg>
            </div>
            <h3 className="font-serif text-2xl text-leroy-black mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500 mb-6">Intenta ajustar los filtros de búsqueda.</p>
            <button 
              onClick={onClearFilters}
              className="border border-leroy-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-leroy-black hover:text-white transition-colors"
            >
              Ver todas las propiedades
            </button>
          </div>
        )}
        
        {/* SEO / Description Text at bottom (Typical of JamesEdition) */}
        {properties.length > 0 && (
          <div className="mt-20 pt-10 border-t border-gray-100">
             <h2 className="font-serif text-2xl text-leroy-black mb-4">Sobre esta colección</h2>
             <p className="text-gray-500 text-sm leading-relaxed max-w-4xl columns-1 md:columns-2 gap-12">
               Descubra las mejores propiedades en {category === 'premium' ? 'nuestra colección Premium' : category}. 
               Nuestra colección incluye desde modernas villas hasta penthouses históricos, todos seleccionados rigurosamente 
               para satisfacer los estándares más altos. LeRoy Residence es su socio confiable en el mercado inmobiliario de lujo.
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListingView;
