
import React, { useState, useEffect } from 'react';
import { HeroSearchState } from '../types';

interface HeroProps {
  onSearch: (filters: HeroSearchState) => void;
  onQuickLinkClick?: (label: string) => void;
  isSearching: boolean;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2560&auto=format&fit=crop", // Terraza cristal frente al lago
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2560&auto=format&fit=crop", // Interior madera lujo
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2560&auto=format&fit=crop"  // Cocina moderna isla
];

const QUICK_LINKS = [
  { label: 'Casas espectaculares', id: 'spectacular' },
  { label: 'Lugares únicos', id: 'unique' },
  { label: 'Decoraciones', id: 'decor' }
];

const Hero: React.FC<HeroProps> = ({ onSearch, onQuickLinkClick, isSearching }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      bedrooms: 'any',
      priceRange: 'any'
    });
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      {/* Dynamic Background */}
      {HERO_IMAGES.map((img, idx) => (
        <div 
          key={idx} 
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <img 
            src={img} 
            className="w-full h-full object-cover" 
            alt={`Hero ${idx}`}
            onLoad={() => console.log(`Image ${idx} loaded`)}
          />
          {/* Overlay casi invisible (1%) solo para que el blanco del texto no se pierda */}
          <div className="absolute inset-0 bg-black/[0.01]"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-5xl px-6 text-center transform translate-y-10">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white mb-6 tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          Viviendo lo Extraordinario
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Busca por ciudad, país o estilo de vida..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/30 backdrop-blur-2xl border border-white/50 px-8 py-4 md:py-6 rounded-full text-white placeholder-white outline-none text-lg transition-all focus:bg-white focus:text-leroy-black focus:placeholder-gray-400 group-hover:border-white shadow-2xl"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-leroy-orange text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:bg-white hover:text-leroy-orange transition-all shadow-xl"
            >
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="mt-8 flex justify-center space-x-8 text-white text-[11px] font-bold uppercase tracking-[0.2em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {QUICK_LINKS.map(item => (
              <span 
                key={item.label} 
                onClick={() => onQuickLinkClick?.(item.label)}
                className="cursor-pointer hover:text-leroy-orange transition-all duration-300 border-b-2 border-transparent hover:border-leroy-orange pb-1"
              >
                {item.label}
              </span>
            ))}
          </div>
        </form>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <span className="text-white text-[9px] font-bold uppercase tracking-widest mb-2 drop-shadow-md">Explorar</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-leroy-orange to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;

