
import React, { useState } from 'react';

interface ShowroomViewProps {
  onGoHome: () => void;
}

const KITCHEN_TRENDS = [
  {
    id: 1,
    title: "Cocinas de Inducción",
    category: "TE MOSTRAMOS AHORA",
    image: "", 
    description: "Descubre la revolución de la cocina invisible. Superficies de porcelanato que cocinan, limpian y decoran. Una integración perfecta entre tecnología y diseño para el hogar moderno."
  },
  {
    id: 2,
    title: "Inducción Invisible TPB Tech",
    category: "Innovación",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    description: "La encimera desaparece. Cocina directamente sobre la superficie porcelánica, ganando espacio de trabajo y facilitando la limpieza absoluta."
  }
];

const ShowroomView: React.FC<ShowroomViewProps> = ({ onGoHome }) => {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <button onClick={onGoHome} className="flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-orange transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Volver a Inicio
          </button>
        </div>

        <div className="mb-20 border-b border-gray-100 pb-12">
          <span className="text-[10px] font-bold text-leroy-orange tracking-[0.3em] uppercase mb-4 block">
            Showroom & Tendencias
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-leroy-black mb-6 leading-tight max-w-4xl">
            Nuevas tecnologías en la cocina
          </h1>
          <p className="font-serif italic text-2xl text-gray-400 max-w-3xl">
            Tu cocina, más eficiente, cómoda, y linda con todos los avances que te contamos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {KITCHEN_TRENDS.map((item) => (
            <article key={item.id} className="group">
              <div className="bg-leroy-gray p-12 border border-gray-100 h-full flex flex-col justify-center items-start transition-all hover:bg-white hover:shadow-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest mb-6 text-leroy-orange">{item.category}</span>
                <h3 className="font-serif text-4xl mb-6 group-hover:text-leroy-orange transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">{item.description}</p>
                <button className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-leroy-black pb-1 hover:border-leroy-orange hover:text-leroy-orange transition-all">Explorar Tecnología</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowroomView;

