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
    <div onClick={onClick} className="group cursor-pointer flex flex-col h-full">
      <div className="relative overflow-hidden w-full h-80 bg-gray-100 mb-3">
        <img 
          src={property.imageUrl} 
          alt={`${property.type} en ${property.location} - ${property.title}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-black border border-black/5 shadow-sm">
          {property.type}
        </div>
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex flex-col w-full items-baseline mb-2">
            <span className="text-xl font-bold text-black">
              {property.price === 0 ? 'Precio a consultar' : mainPriceDisplay}
            </span>

            {secondaryPriceDisplay && property.price > 0 && (
              <span className="text-xs text-gray-500 font-medium mt-0.5">
                {secondaryPriceDisplay}
              </span>
            )}
        </div>

        <h3 className="font-serif text-lg text-black line-clamp-2 mb-1 group-hover:underline decoration-1 underline-offset-4 leading-tight">
          {property.title}
        </h3>

        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">
          {property.location}
        </p>

        <div className="flex items-center space-x-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider pt-2 border-t border-gray-50 mt-1">
             <span>{property.bedrooms} hab.</span>
             <span className="w-px h-3 bg-gray-300"></span>
             <span>{property.area} m²</span>
        </div>
      </div>
    </div>
  );
};
