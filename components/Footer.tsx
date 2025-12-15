import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (view: string, category?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar lógica para enviar el email o mostrar mensaje
    alert(`Gracias por suscribirte con ${email}`);
    setEmail('');
  };

  return (
    <footer className="bg-leroy-black text-white py-16 mt-20 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="font-serif font-semibold tracking-tighter flex items-baseline mb-6 hover:opacity-80 transition-opacity" aria-label="Ir al inicio LeRoy Residence">
              <span className="text-4xl">L</span>
              <span className="text-2xl">e</span>
              <span className="text-4xl -ml-0.5">R</span>
              <span className="text-2xl">oy</span>
              <span className="text-2xl ml-2">Residence</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
              La plataforma definitiva para descubrir y vender las propiedades más exclusivas. 
              Excelencia, discreción y resultados excepcionales.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholders */}
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-leroy-gold cursor-pointer transition-colors" aria-label="Instagram">IG</div>
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-full hover:bg-leroy-gold cursor-pointer transition-colors" aria-label="LinkedIn">LI</div>
            </div>
          </div>

          {/* Links Column 1: Explore (Buyers) */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm text-gray-300 font-light">
              <li><button onClick={() => onNavigate('listing', 'Bienes Raíces')} className="hover:text-leroy-gold transition-colors">Bienes Raíces</button></li>
              <li><button onClick={() => onNavigate('listing', 'Desarrollos')} className="hover:text-leroy-gold transition-colors">Desarrollos</button></li>
              <li><button onClick={() => onNavigate('showroom')} className="hover:text-leroy-gold transition-colors">Showroom Cocinas</button></li>
              <li><button onClick={() => onNavigate('listing', 'Premium Property')} className="hover:text-leroy-gold transition-colors">Propiedades Premium</button></li>
            </ul>
          </div>

          {/* Links Column 2: Owners (Sellers - New Section) */}
          <div>
             <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-leroy-gold mb-6">Propietarios</h4>
            <ul className="space-y-4 text-sm text-gray-300 font-light">
              <li><button onClick={() => alert('Función no implementada')} className="hover:text-white transition-colors">Venda su Propiedad</button></li>
              <li><button onClick={() => alert('Función no implementada')} className="hover:text-white transition-colors">Solicitar Tasación</button></li>
              <li><button onClick={() => alert('Función no implementada')} className="hover:text-white transition-colors">Marketing Exclusivo</button></li>
              <li><button onClick={() => alert('Función no implementada')} className="hover:text-white transition-colors">Contáctenos</button></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4 font-light">
              Reciba una selección semanal de las mejores oportunidades.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex border-b border-gray-700 pb-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="bg-transparent w-full text-white placeholder-gray-600 focus:outline-none text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-label="Correo electrónico para newsletter"
              />
              <button 
                type="submit"
                className="text-xs uppercase font-bold tracking-widest text-white hover:text-leroy-gold transition-colors"
                aria-label="Enviar correo para newsletter"
              >
                Enviar
              </button>
            </form>
          </div>
          
        </div>

        <div class
