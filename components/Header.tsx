
import React, { useState, useEffect } from 'react';
import { COMMUNES } from '../constants';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentView: 'home' | 'listing' | 'admin' | 'detail';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Communes List (Text Links)
  const communeItems = COMMUNES.map(commune => ({ label: commune, id: commune }));

  // 2. Main Categories (Bordered Buttons)
  const categoryItems = [
    { label: 'Bienes Raíces', id: 'real_estate' },
    { label: 'Show room Cocinas', id: 'showroom_kitchens' },
    { label: 'Desarrollos', id: 'developments' },
    { label: 'Premium Property', id: 'premium' }
  ];

  // Logic: Transparent on Home (unless scrolled), Solid White on Listing/Admin/Detail Pages always
  const isHome = currentView === 'home';
  const headerBaseClass = isHome && !scrolled
    ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white'
    : 'bg-white text-leroy-black shadow-sm border-b border-gray-100';

  // Dynamic border color for the buttons based on background
  const buttonBorderClass = isHome && !scrolled ? 'border-white hover:bg-white/10' : 'border-leroy-black hover:bg-black/5';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out py-6 ${headerBaseClass}`}
    >
      <div className="w-full px-6 md:px-12">
        <div className="flex flex-col items-start">
          
          {/* Top Row: Logo & Actions */}
          <div className="flex justify-between items-end w-full mb-6">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="font-serif font-semibold tracking-tighter flex items-baseline hover:opacity-90 transition-opacity select-none">
                <span className="text-5xl">L</span>
                <span className="text-3xl">e</span>
                <span className="text-5xl -ml-0.5">R</span>
                <span className="text-3xl">oy</span>
                <span className="text-3xl ml-2">
                  Residence
                </span>
              </div>
            </div>

            {/* Admin Buttons (Hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-6 mb-2">
              <button 
                onClick={() => onNavigate('admin')}
                className="text-xs font-bold tracking-widest uppercase hover:text-leroy-gold transition-colors"
              >
                Ingresar
              </button>
              <button 
                onClick={() => onNavigate('admin')}
                className={`border px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${buttonBorderClass}`}
              >
                Publicar
              </button>
            </div>
            
            {/* Mobile Menu Icon */}
            <div className="md:hidden mb-1">
               <button className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Container */}
          <div className="hidden md:flex flex-col w-full items-start gap-y-5">
            
            {/* Row 1: Communes (Text Links) */}
            <div className="flex flex-wrap gap-x-6">
              {communeItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => onNavigate(item.id)}
                  className="text-[11px] font-bold tracking-[0.1em] uppercase hover:text-leroy-gold transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Row 2: Main Categories (Bordered Buttons) */}
            <div className="flex flex-wrap gap-x-4">
              {categoryItems.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => onNavigate(item.id)}
                  className={`bg-transparent border px-6 py-2 text-[11px] font-bold tracking-[0.15em] uppercase transition-all ${buttonBorderClass}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
