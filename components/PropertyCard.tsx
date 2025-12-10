import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

const UF_VALUE_CLP = 37800;
const USD_VALUE_CLP = 950;
const EUR_VALUE_CLP = 1020;

const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  let mainPriceDisplay = '';
  let secondaryPriceDisplay = '';
  
  const cleanCurrency = property.currency.trim();
  const price = property.price;

  if (cleanCurrency === 'UF') {
    mainPriceDisplay = `UF ${price.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    secondaryPriceDisplay = formatCLP(price * UF_VALUE_CLP);
  } else if (cleanCurrency === '$') {
    const clp = price * USD_VALUE_CLP;
    const uf = clp / UF_VALUE_CLP;
    mainPriceDisplay = `UF ${uf.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    secondaryPriceDisplay = formatCLP(clp);
  } else if (cleanCurrency === '€') {
    const clp = price * EUR_VALUE_CLP;
    const uf = clp / UF_VALUE_CLP;
    mainPriceDisplay = `UF ${uf.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    secondaryPriceDisplay = formatCLP(clp);
  } else {
    mainPriceDisplay = `${cleanCurrency} ${price.toLocaleString()}`;
  }

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white transition-all duration-300 ease-in-out">
      {/* Image Container */}
      <div className="relative overflow-hidden w-full aspect-[4/3] bg-gray-100" onClick={onClick}>
        <img 
          src={property.imageUrl} 
          alt={`${property.type} en ${property.location}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Top Right Actions (JamesEdition style Heart) */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button className="bg-white/90 hover:bg-white text-gray-900 p-2 rounded-sm shadow-sm transition-colors" title="Guardar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </button>
        </div>

        {/* Badges (Minimalist) */}
        <div className="absolute top-3 left-3 flex gap-2">
            {property.isPremium && (
                <span className="bg-leroy-black/90 text-white px-2 py-1 text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
                    Destacado
                </span>
            )}
        </div>
      </div>

      <div className="flex flex-col text-left pt-4 pb-2 flex-grow" onClick={onClick}>
        {/* Location - Uppercase Small */}
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 truncate">
          {property.location}
        </p>

        {/* Title - Serif Elegant */}
        <h3 className="font-serif text-xl text-leroy-black line-clamp-2 mb-2 leading-tight group-hover:text-leroy-gold transition-colors">
          {property.title}
        </h3>

        {/* Price - Prominent */}
        <div className="mt-auto">
            <div className="flex flex-col mb-3">
                <span className="text-lg font-bold text-leroy-black font-sans">
                {property.price === 0 ? 'Precio a consultar' : mainPriceDisplay}
                </span>
                {property.currency !== 'UF' && property.price !== 0 && (
                   <span className="text-xs text-gray-400 mt-0.5 hidden group-hover:block transition-all">Aprox. {secondaryPriceDisplay}</span>
                )}
            </div>
            
            {/* Specs Row - Clean with dots */}
            <div className="flex items-center text-xs text-gray-500 font-medium border-t border-gray-100 pt-3 mt-1">
                <div className="flex items-center gap-1">
                    <span className="text-black font-bold">{property.bedrooms}</span> <span className="text-[10px] uppercase text-gray-400">Hab.</span>
                </div>
                <div className="mx-3 text-gray-300">•</div>
                <div className="flex items-center gap-1">
                    <span className="text-black font-bold">{property.bathrooms}</span> <span className="text-[10px] uppercase text-gray-400">Baños</span>
                </div>
                <div className="mx-3 text-gray-300">•</div>
                <div className="flex items-center gap-1">
                    <span className="text-black font-bold">{property.area}</span> <span className="text-[10px] uppercase text-gray-400">m²</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
