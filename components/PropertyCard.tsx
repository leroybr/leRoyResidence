import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

// Valores de conversión estáticos utilizados en la tarjeta
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
    <div onClick={onClick} className="group cursor-pointer flex flex-col h-full bg-white hover:shadow-xl transition-all duration-300 ease-in-out border border-transparent hover:border-gray-100">
      {/* Image Container - JamesEdition style: Clean, usually 4:3 aspect ratio */}
      <div className="relative overflow-hidden w-full aspect-[4/3] bg-gray-100">
        <img 
          src={property.imageUrl} 
          alt={`${property.type} en ${property.location} - ${property.title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges / Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
            {property.isPremium && (
                <span className="bg-leroy-black text-white px-2 py-1 text-[9px] font-bold tracking-widest uppercase">
                    Premium
                </span>
            )}
            <span className="bg-white/95 text-leroy-black px-2 py-1 text-[9px] font-bold tracking-widest uppercase shadow-sm">
                {property.type}
            </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col text-left p-5 flex-grow">
        {/* Location - Uppercase and small */}
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 truncate">
          {property.location}
        </p>

        {/* Title - Serif, elegant */}
        <h3 className="font-serif text-lg text-leroy-black line-clamp-2 mb-3 leading-snug group-hover:text-leroy-gold transition-colors">
          {property.title}
        </h3>

        {/* Price - Bold */}
        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex flex-col">
                <span className="text-lg font-bold text-leroy-black font-sans">
                {property.price === 0 ? 'Precio a consultar' : mainPriceDisplay}
                </span>
                {secondaryPriceDisplay && property.price > 0 && (
                <span className="text-xs text-gray-400 font-medium mt-0.5">
                    {secondaryPriceDisplay}
                </span>
                )}
            </div>
            
            {/* Specs Row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                    <span>{property.bedrooms}</span> <span className="text-[10px] uppercase">Hab.</span>
                </div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                    <span>{property.bathrooms}</span> <span className="text-[10px] uppercase">Baños</span>
                </div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                    <span>{property.area}</span> <span className="text-[10px] uppercase">m²</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
