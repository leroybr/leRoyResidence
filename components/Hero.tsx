// components/Hero.tsx
import React from 'react';

// --- INTERFAZ CORREGIDA ---
// Se define la interfaz para que TypeScript sepa que el componente Hero acepta 'onNavigate'.
interface HeroProps {
  onNavigate: (view: string, category?: string) => void;
}
// --------------------------

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    
    // Función de ejemplo que utiliza la prop onNavigate, 
    // resolviendo así el error TS6133 ('onNavigate' is declared but its value is never read).
    const handleNavigation = (view: string, category?: string) => {
        // En un Hero típico, podrías navegar a la página de propiedades
        // o a la vista de administración.
        console.log(`Navegando a la vista: ${view}`);
        onNavigate(view, category);
    };

    return (
        <section className="relative bg-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <header className="text-center mb-12">
                    <h1 className="font-serif text-5xl md:text-6xl font-light text-leroy-black leading-tight">
                        Encuentra la Residencia de Tus Sueños
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Propiedades de lujo y exclusivas, seleccionadas con distinción.
                    </p>
                </header>

                {/* Ejemplo de uso de onNavigate en un botón */}
                <div className="flex justify-center space-x-6">
                    <button
                        onClick={() => handleNavigation('properties')}
                        className="bg-leroy-gold text-white px-8 py-3 rounded-lg text-lg font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors shadow-lg"
                    >
                        Explorar Propiedades
                    </button>
                    
                    {/* Botón opcional para el acceso rápido al admin (uso de ejemplo) */}
                    <button
                        onClick={() => handleNavigation('admin')}
                        className="border border-leroy-black text-leroy-black px-8 py-3 rounded-lg text-lg font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                        Acceso Admin
                    </button>
                </div>

                {/* Puedes añadir más contenido, filtros o imágenes aquí */}
                <div className="mt-16 rounded-xl overflow-hidden shadow-2xl">
                   {/* Imagen de una propiedad de lujo para el Hero */}
                   
                </div>
            </div>
        </section>
    );
};

export default Hero;
