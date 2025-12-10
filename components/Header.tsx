import React, { useState, useEffect } from 'react';
import { COMMUNES } from '../constants';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, category?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const communeItems = COMMUNES;

  const categoryItems = [
    { label: 'Bienes Raíces', action: () => onNavigate('listing', 'Bienes Raíces') },
    { label: 'Show room Cocinas', action: () => onNavigate('showroom') },
    { label: 'Desarrollos', action: () => onNavigate('listing', 'Desarrollos') },
    { label: 'Premium Property', action: () => onNavigate('listing', 'Premium Property') }
  ];

  const isHome = currentView === 'home';
  
  const headerBaseClass = isHome && !scrolled && !isMobileMenuOpen
    ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white'
    : 'bg-white text-leroy-black shadow-sm border-b border-gray-100';

  const logoColorClass = isHome && !scrolled && !isMobileMenuOpen ? 'text-white' : 'text-leroy-black';
  const hamburgerColorClass = isHome && !scrolled && !isMobileMenuOpen ? 'text-white' : 'text-leroy-black';

  const cityStripBorderClass = isHome && !scrolled && !isMobileMenuOpen 
    ? 'border-white/30' 
    : 'border-gray-200';

  const cityBtnClass = isHome && !scrolled && !isMobileMenuOpen 
    ? 'text-gray-200 hover:text-white' 
    : 'text-gray-500 hover:text-leroy-black';

  const categoryBtnClass = 'hover:text-leroy-gold'; 

  const handleNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your backend or email service
    setFormSubmitted(true);
    setTimeout(() => {
        setIsContactModalOpen(false);
        setFormSubmitted(false);
        setContactName('');
        setContactPhone('');
    }, 3000);
  };

  return (
    <>
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out py-4 md:py-6 ${headerBaseClass}`}>
      <div className="w-full px-6 md:px-12">
        <div className="flex flex-col items-start">
          
          <div className="flex justify-between items-end w-full mb-0 md:mb-3">
            {/* LOGO */}
            <div className={`flex-shrink-0 cursor-pointer group ${logoColorClass}`} onClick={() => handleNav(() => onNavigate('home'))}>
              <div className="font-serif font-semibold tracking-tighter flex items-baseline hover:opacity-90 transition-opacity select-none">
                <span className="text-3xl sm:text-4xl md:text-5xl">L</span>
                <span className="text-xl sm:text-2xl md:text-3xl">e</span>
                <span className="text-3xl sm:text-4xl md:text-5xl -ml-0.5">R</span>
                <span className="text-xl sm:text-2xl md:text-3xl">oy</span>
                <span className="text-xl sm:text-2xl md:text-3xl ml-2">Residence</span>
              </div>
            </div>
            
            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-4 mb-1">
                {/* NEW CONTACT BUTTON */}
                <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="hidden md:block bg-leroy-black text-white px-5 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md hover:shadow-lg border border-transparent hover:border-gray-700"
                >
                    Te contacto
                </button>

                {/* Desktop "INGRESAR" Button */}
                <button 
                    onClick={() => onNavigate('admin')}
                    className={`hidden md:block text-[10px] font-bold uppercase tracking-widest hover:text-leroy-gold transition-colors ${logoColorClass}`}
                >
                    Ingresar
                </button>

                {/* Mobile Hamburger */}
                <div className="md:hidden flex items-center gap-4">
                     <button 
                        onClick={() => setIsContactModalOpen(true)}
                        className="bg-leroy-black text-white px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest"
                    >
                        Contacto
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-1 focus:outline-none ${hamburgerColorClass}`}>
                        {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>
                        )}
                    </button>
                </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col w-full items-start gap-y-3">
            <div className={`w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] -ml-6 md:-ml-12 flex flex-wrap gap-x-8 gap-y-2 justify-center py-1 border-y transition-colors duration-500 ${cityStripBorderClass}`}>
              {communeItems.map((commune) => (
                <button 
                  key={commune} 
                  onClick={() => handleNav(() => onNavigate('listing', commune))} 
                  className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all ${cityBtnClass}`}
                >
                  {commune}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-x-6 pl-1 w-full justify-center pt-1">
              {categoryItems.map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => handleNav(item.action)} 
                  className={`bg-transparent text-[11px] font-bold tracking-[0.15em] uppercase transition-all ${categoryBtnClass}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col p-6 animate-in slide-in-from-top-5 duration-300 h-screen overflow-y-auto pb-32">
          
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
             <span className="font-serif text-lg text-leroy-black">Menú</span>
             <button 
                onClick={() => handleNav(() => onNavigate('admin'))} 
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-leroy-gold hover:text-leroy-black transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Ingresar
             </button>
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-leroy-gold mb-4">Ubicaciones</h4>
            <div className="flex flex-wrap gap-2">
              {communeItems.map((commune) => (
                <button key={commune} onClick={() => handleNav(() => onNavigate('listing', commune))} className="border border-gray-200 rounded-full px-3 py-1 text-xs font-bold uppercase text-gray-600 hover:border-leroy-gold hover:text-leroy-gold transition-colors">
                  {commune}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8 border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-leroy-gold mb-4">Categorías</h4>
            <div className="flex flex-col gap-4">
              {categoryItems.map((item) => (
                <button key={item.label} onClick={() => handleNav(item.action)} className="w-full text-left text-sm font-bold text-leroy-black hover:text-leroy-gold transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>

    {/* CONTACT MODAL */}
    {isContactModalOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsContactModalOpen(false)}
        >
            <div 
                className="bg-white w-full max-w-md p-8 shadow-2xl relative border-t-4 border-leroy-black"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={() => setIsContactModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="font-serif text-2xl text-leroy-black mb-2">Contáctanos</h2>
                <p className="text-gray-500 text-sm mb-6 font-light">
                    Estamos disponibles para atender tus requerimientos. Elige tu vía de preferencia.
                </p>

                {/* Option 1: WhatsApp */}
                <a 
                    href="https://wa.me/56912345678" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-3 mb-6 hover:bg-[#128C7E] transition-colors rounded-sm shadow-sm group"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Contactar por WhatsApp</span>
                </a>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">O déjanos tus datos</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Option 2: Form */}
                {formSubmitted ? (
                    <div className="text-center py-6 bg-gray-50 rounded-sm">
                        <div className="text-green-500 mb-2 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <h3 className="font-serif text-xl text-leroy-black">¡Recibido!</h3>
                        <p className="text-gray-500 text-sm mt-1">Te contactaremos a la brevedad.</p>
                    </div>
                ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tu Nombre</label>
                            <input 
                                type="text" 
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                className="w-full border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-leroy-gold focus:ring-0 rounded-sm"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Tu Teléfono</label>
                            <input 
                                type="tel" 
                                required
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className="w-full border-gray-300 bg-gray-50 p-2.5 text-sm focus:border-leroy-gold focus:ring-0 rounded-sm"
                                placeholder="+56 9 ..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-leroy-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg mt-2"
                        >
                            Solicitar Contacto
                        </button>
                    </form>
                )}
            </div>
        </div>
    )}
    </>
  );
};

export default Header;
