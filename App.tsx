import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Base de Datos de Propiedades (Aquí puedes añadir tus fotos de Concepción) ---
const LUXURY_PROPERTIES = [
  {
    id: '1',
    title: 'Residencia O’Higgins',
    location: 'Concepción, Chile',
    price: 'UF 12.500',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '2',
    title: 'Penthouse El Golf',
    location: 'Santiago, Chile',
    price: 'UF 24.000',
    image: 'https://images.unsplash.com/photo-1600607687940-4e524cb35a3a?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: '3',
    title: 'Villa Lonco Parque',
    location: 'Chiguayante, Concepción',
    price: 'UF 18.200',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?auto=format&fit=crop&w=1200&q=80'
  }
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-600">
      {/* Navegación */}
      <Navbar />

      {/* Hero Section: El impacto visual principal */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Real Estate"
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-tighter">
            LeRoy <span className="text-yellow-500 italic">Residence</span>
          </h1>
          <p className="text-sm md:text-lg uppercase tracking-[0.5em] text-gray-400 font-light">
            Propiedades Exclusivas • Concepción • Santiago
          </p>
        </div>
      </section>

      {/* Listado de Propiedades: Estilo Galería de Arte */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-4xl font-serif mb-2">Colección Destacada</h2>
            <div className="h-1 w-20 bg-yellow-500" />
          </div>
          <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Explorar todas las propiedades →</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {LUXURY_PROPERTIES.map((prop) => (
            <div key={prop.id} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/5] mb-6">
                <img 
                  src={prop.image} 
                  alt={prop.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-xl font-serif mb-1 group-hover:text-yellow-500 transition-colors">{prop.title}</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">{prop.location}</p>
              <p className="text-lg font-light text-yellow-500/80">{prop.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
