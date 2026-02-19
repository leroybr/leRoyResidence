
import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyDetailViewProps {
  property: Property;
  onGoHome?: () => void;
}

const UF_VALUE_CLP = 37800;
const USD_VALUE_CLP = 950;
const EUR_VALUE_CLP = 1020;

const getPriceDisplay = (price: number, currency: string) => {
  let priceUF = 0;
  let priceCLP = 0;
  const cleanCurrency = currency.trim();

  if (cleanCurrency === 'UF') {
    priceUF = price;
    priceCLP = price * UF_VALUE_CLP;
  } else if (cleanCurrency === '$' || cleanCurrency === 'USD') {
    priceCLP = price * USD_VALUE_CLP;
    priceUF = priceCLP / UF_VALUE_CLP;
  } else if (cleanCurrency === '€') {
    priceCLP = price * EUR_VALUE_CLP;
    priceUF = priceCLP / UF_VALUE_CLP;
  } else {
    priceCLP = price;
    priceUF = price / UF_VALUE_CLP;
  }

  return {
    uf: `UF ${priceUF.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`,
    clp: `$ ${priceCLP.toLocaleString('es-CL')}`
  };
};

const ADDITIONAL_IMAGES = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop", // Comedor Madera
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop", // Cocina Isla Blanca
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", // Terraza Exterior
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop"  // Baño Lujo
];

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onGoHome }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Use property.imageUrl as the first image
  const galleryImages = [property.imageUrl, ...ADDITIONAL_IMAGES];
  
  const { uf, clp } = getPriceDisplay(property.price, property.currency);
  const amenities = property.amenities && property.amenities.length > 0 
    ? property.amenities 
    : ['Seguridad 24/7', 'Estacionamiento', 'Vista Panorámica', 'Piscina'];

  return (
    <div className="pt-40 pb-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-8 mb-8 flex justify-between items-center">
        {onGoHome && (
          <button onClick={onGoHome} className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-orange transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver
          </button>
        )}
        <div className="flex space-x-4">
            <button className="p-2 border border-gray-100 rounded-full hover:border-leroy-orange hover:text-leroy-orange transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg></button>
            <button className="p-2 border border-gray-100 rounded-full hover:border-leroy-orange hover:text-leroy-orange transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mb-16">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-leroy-black mb-6 leading-tight">{property.title}</h1>
        <div className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {property.location}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mb-16 grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
          <div className="md:col-span-2 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(galleryImages[0])}>
            <img src={galleryImages[0]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {galleryImages.slice(1, 5).map((img, i) => (
              <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImage(img)}>
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
              </div>
            ))}
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-6 mb-12 border-b border-gray-100 pb-12">
               <span className="font-serif text-5xl text-leroy-orange">{uf}</span>
               <span className="text-xl text-gray-400">{clp}</span>
            </div>
            
            <h3 className="font-serif text-3xl mb-8">Descripción</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-12 whitespace-pre-wrap">{property.description}</p>
            
            <h3 className="font-serif text-3xl mb-8">Comodidades</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
              {amenities.map(a => (
                <div key={a} className="flex items-center text-gray-500 font-medium">
                  <svg className="w-5 h-5 mr-3 text-leroy-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {a}
                </div>
              ))}
            </div>
          </div>

          <aside className="relative">
            <div className="sticky top-40 bg-leroy-gray p-10 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-leroy-orange">Contactar un Experto</h4>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <p className="font-bold">LeRoy Global Concierge</p>
                    <p className="text-xs text-gray-400">Atención personalizada 24/7</p>
                  </div>
                </div>
                <button className="w-full bg-leroy-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-leroy-orange transition-all mb-4 shadow-lg">Solicitar Información</button>
                <button className="w-full border border-leroy-black text-leroy-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-leroy-black hover:text-white transition-all">Programar Visita</button>
            </div>
          </aside>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex justify-center items-center p-8 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="max-w-full max-h-full object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default PropertyDetailView;

