
import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentView: 'home' | 'listing' | 'admin' | 'detail' | 'showroom';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showRealEstateDropdown, setShowRealEstateDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRealEstateDropdown(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isHome = currentView === 'home';
  const headerBaseClass = isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white text-leroy-black shadow-md border-b border-gray-100';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${headerBaseClass}`}>
      {/* Top Utility Bar */}
      <div className={`w-full px-8 py-2 border-b flex justify-between items-center text-[9px] font-bold tracking-ultra-wide uppercase transition-colors duration-500 ${!isHome || scrolled ? 'border-gray-100 text-gray-500' : 'border-white/10 text-white/70'}`}>
        <div className="flex space-x-8">
          <span className="cursor-pointer hover:text-leroy-orange transition-colors">Chile / Español</span>
          <span className="cursor-pointer hover:text-leroy-orange transition-colors">UF / CLP</span>
        </div>
        <div className="flex space-x-8">
          <button onClick={() => onNavigate('admin')} className="text-leroy-orange hover:opacity-80 transition-all font-extrabold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-leroy-orange rounded-full animate-pulse"></span>
            Publicar Propiedad
          </button>
          <button onClick={() => onNavigate('real_estate')} className="hover:text-leroy-orange transition-colors">Propiedades en venta</button>
          <button className="hover:text-leroy-orange transition-colors">Favoritos (0)</button>
          <button className="hover:text-leroy-orange transition-colors">Iniciar Sesión</button>
        </div>
      </div>

      <div className="w-full px-8 py-5 md:py-7">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
            <h1 className="font-serif text-2xl md:text-3xl tracking-[0.15em] uppercase flex items-center group">
              LeRoy <span className="ml-3 font-light text-leroy-orange group-hover:text-leroy-black transition-colors duration-500">Residence</span>
            </h1>
          </div>

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            <div className="relative" ref={dropdownRef}>
              <button 
                onMouseEnter={() => setShowRealEstateDropdown(true)}
                className="text-[11px] font-bold tracking-premium uppercase hover:text-leroy-orange transition-all flex items-center gap-2"
              >
                Inmuebles
                <svg className={`w-3 h-3 transition-transform ${showRealEstateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {showRealEstateDropdown && (
                <div 
                  className="absolute top-full left-0 mt-6 w-56 bg-white text-leroy-black shadow-2xl border border-gray-100 py-6 animate-fadeIn"
                  onMouseLeave={() => setShowRealEstateDropdown(false)}
                >
                  {['En Venta', 'En Arriendo', 'Propiedades Premium', 'Nuevos Desarrollos'].map((item) => (
                    <button 
                      key={item}
                      onClick={() => { onNavigate('real_estate'); setShowRealEstateDropdown(false); }}
                      className="w-full px-8 py-3 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-leroy-gray hover:text-leroy-orange transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => onNavigate('showroom_kitchens')} className="text-[11px] font-bold tracking-premium uppercase hover:text-leroy-orange transition-all">Showroom</button>
            <button className="text-[11px] font-bold tracking-premium uppercase hover:text-leroy-orange transition-all">Estilo de Vida</button>
            <button className="text-[11px] font-bold tracking-premium uppercase hover:text-leroy-orange transition-all">Revista</button>
          </nav>

          {/* Search Trigger */}
          <div className="flex items-center space-x-6">
            <button className={`p-2 transition-colors ${!isHome || scrolled ? 'text-leroy-black' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
