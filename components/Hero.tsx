// components/Hero.tsx
import React, { useState } from 'react';
import { HeroSearchState } from '../types'; // Importar HeroSearchState

interface HeroProps {
    onSearch: (filters: HeroSearchState) => void;
    onNavigate: (view: string, category?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch, onNavigate }) => {
    // --- Estado Local del Formulario ---
    const [location, setLocation] = useState('');
    const [bedrooms, setBedrooms] = useState('any'); // 'any' | '1+' | '2+' ...
    const [priceRange, setPriceRange] = useState('any'); // 'any' | '0-50000000' ...
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        const filters: HeroSearchState = {
            location: location.trim(),
            bedrooms: bedrooms,
            priceRange: priceRange,
        };
        
        onSearch(filters);
        onNavigate('properties', 'Resultados de Búsqueda');
    };

    return (
        <section className="relative bg-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <header className="text-center mb-16">
                    <h1 className="font-serif text-5xl md:text-6xl font-light text-leroy-black leading-tight">
                        Encuentra la Residencia de Tus Sueños
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Propiedades de lujo y exclusivas, seleccionadas con distinción.
                    </p>
                </header>

                {/* --- FORMULARIO DE BÚSQUEDA (El Hero) --- */}
                <form onSubmit={handleSearch} className="relative z-10 -mt-8 mx-auto max-w-4xl bg-white p-6 md:p-8 rounded-lg shadow-xl border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        
                        {/* 1. Ubicación */}
                        <div>
                            <label htmlFor="location" className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Ubicación</label>
                            <input
                                id="location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ciudad, Comuna o Barrio"
                                className="w-full border-gray-300 p-3 text-sm focus:border-leroy-gold focus:ring-leroy-gold transition-colors"
                            />
                        </div>
                        
                        {/* 2. Dormitorios */}
                        <div>
                            <label htmlFor="bedrooms" className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Dormitorios</label>
                            <select
                                id="bedrooms"
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                                className="w-full border-gray-300 p-3 text-sm focus:border-leroy-gold focus:ring-leroy-gold transition-colors appearance-none"
                            >
                                <option value="any">Cualquiera</option>
                                <option value="1+">1+</option>
                                <option value="2+">2+</option>
                                <option value="3+">3+</option>
                                <option value="4+">4+</option>
                            </select>
                        </div>

                        {/* 3. Rango de Precio (CLP) */}
                        <div>
                            <label htmlFor="priceRange" className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Precio (CLP)</label>
                            <select
                                id="priceRange"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full border-gray-300 p-3 text-sm focus:border-leroy-gold focus:ring-leroy-gold transition-colors appearance-none"
                            >
                                <option value="any">Cualquier Precio</option>
                                <option value="0-50000000">Hasta $50M</option>
                                <option value="50000001-100000000">$50M - $100M</option>
                                <option value="100000001-200000000">$100M - $200M</option>
                                <option value="200000001-500000000">$200M - $500M</option>
                                <option value="500000001-999999999999">Más de $500M</option>
                            </select>
                        </div>
                        
                        {/* 4. Botón de Búsqueda */}
                        <button
                            type="submit"
                            className="w-full bg-leroy-gold text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-yellow-600 transition-colors shadow-lg"
                        >
                            Buscar Propiedades
                        </button>
                    </div>
                </form>

                {/* Contenido de ejemplo adicional */}
                <div className="mt-20 flex justify-center space-x-6">
                    <button
                        onClick={() => onNavigate('admin')}
                        className="border border-leroy-black text-leroy-black px-8 py-3 rounded-lg text-lg font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                        Acceso Admin
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
