
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-leroy-black pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          <div className="lg:col-span-2">
            <h1 className="font-serif text-3xl uppercase tracking-widest mb-8">
              LeRoy <span className="text-leroy-orange">Residence</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8">
              La plataforma de bienes raíces de lujo más importante del sur de Chile. Curaduría experta para los estilos de vida más exigentes.
            </p>
            <div className="flex space-x-5">
              {['Instagram', 'Facebook', 'LinkedIn', 'YouTube'].map(social => (
                <a key={social} href="#" className="text-gray-400 hover:text-leroy-orange transition-colors text-[10px] font-bold uppercase tracking-widest">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {[
            { 
              title: 'Inmuebles', 
              links: ['Propiedades en Venta', 'Propiedades en Arriendo', 'Nuevos Desarrollos', 'Islas Privadas', 'Mansiones'] 
            },
            { 
              title: 'Empresa', 
              links: ['Sobre Nosotros', 'Nuestra Revista', 'Servicios VIP', 'Prensa', 'Contacto'] 
            },
            { 
              title: 'Soporte', 
              links: ['Términos de Uso', 'Privacidad', 'Cookies', 'Mapa del Sitio'] 
            }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="text-[11px] font-extrabold uppercase tracking-ultra-wide text-leroy-black mb-8">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 hover:text-leroy-orange transition-colors text-xs font-medium">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest uppercase text-gray-400">
          <p>© {new Date().getFullYear()} LEROY RESIDENCE GLOBAL. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="text-leroy-black">Hecho en Chile</span>
            <span className="hover:text-leroy-orange cursor-pointer transition-colors">Accesibilidad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
