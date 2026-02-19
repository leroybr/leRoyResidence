
import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick?: (id: string) => void;
}

const UF_VALUE_CLP = 37800;
const USD_VALUE_CLP = 950;

const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const cleanCurrency = property.currency.trim();
  const price = property.price;
  
  let mainPrice = '';
  let subPrice = '';

  if (cleanCurrency === 'UF') {
    mainPrice = `UF ${price.toLocaleString('es-CL')}`;
    subPrice = formatCLP(price * UF_VALUE_CLP);
  } else if (cleanCurrency === '$' || cleanCurrency === 'USD') {
    mainPrice = `UF ${( (price * USD_VALUE_CLP) / UF_VALUE_CLP ).toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
    subPrice = formatCLP(price * USD_VALUE_CLP);
  } else {
    mainPrice = `${cleanCurrency} ${price.toLocaleString()}`;
  }

  return (
    <div 
      onClick={() => onClick && onClick(property.id)}
      className="group cursor-pointer flex flex-col bg-white transition-all duration-500 hover:shadow-xl border border-transparent hover:border-gray-100"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/95 backdrop-blur px-2 py-1 text-[8px] font-bold tracking-[0.2em] uppercase text-leroy-black shadow-sm">
                {property.type}
            </span>
            {property.isPremium && (
                <span className="bg-leroy-orange text-white px-2 py-1 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                    Premium Selection
                </span>
            )}
        </div>
        <div className="absolute top-4 right-4 bg-white/20 hover:bg-white p-2 rounded-full text-white hover:text-leroy-orange transition-all backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        </div>
      </div>

      <div className="p-6 flex flex-col">
        <h3 className="font-serif text-xl text-leroy-black mb-1 line-clamp-1 group-hover:text-leroy-orange transition-colors">
          {property.title}
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
          {property.location}
        </p>

        <div className="flex flex-col mb-4">
          <span className="text-xl font-bold text-leroy-black tracking-tight">
            {property.price === 0 ? 'Consultar Precio' : mainPrice}
          </span>
          {subPrice && property.price > 0 && (
            <span className="text-[11px] text-gray-400 font-medium italic mt-0.5">
              aprox. {subPrice}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-t border-gray-100 pt-4">
           <span className="flex items-center gap-1.5">
             <span className="text-leroy-black">{property.bedrooms}</span> <span className="opacity-50">Dorm</span>
           </span>
           <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
           <span className="flex items-center gap-1.5">
             <span className="text-leroy-black">{property.bathrooms}</span> <span className="opacity-50">Baños</span>
           </span>
           <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
           <span className="flex items-center gap-1.5">
             <span className="text-leroy-black">{property.area}</span> <span className="opacity-50">m²</span>
           </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;


