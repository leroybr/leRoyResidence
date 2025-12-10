// components/ListingView.tsx

import React from 'react';
import { Property, HeroSearchState, PropertyType } from '../types'; 

// Definición de las interfaces de props que App.tsx le está pasando
interface ListingViewProps {
    properties: Property[];
    category: string;
    searchFilters: HeroSearchState | null;
    onPropertyClick: (property: Property) => void;
    onNavigate: (view: string, category?: string) => void; // Se mantiene y se usa para corregir el error TS6133
}

const ListingView: React.FC<ListingViewProps> = ({ 
    properties, 
    category, 
    searchFilters, 
    onPropertyClick, 
    onNavigate // Se desestructura para USARLA y corregir el error de compilación
}) => {
    
    // Función de ayuda para formatear el precio
    const formatPrice = (price: number, currency: string): string => {
        const formatter = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: currency === 'UF' ? 'CLP' : currency,
            minimumFractionDigits: 0,
        });
        
        // Asumiendo que las monedas comunes son UF, USD, EUR y que CLP es el predeterminado si no se encuentra
        if (currency === 'UF') {
            return `UF ${price.toLocaleString('es-CL')}`;
        }
        return formatter.format(price);
    };

    return (
        <div className="pt-32 p-8 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* Botón de Navegación: CORRECCIÓN para el error TS6133 */}
                <button 
                    onClick={() => onNavigate('home')} 
                    className="mb-8 text-sm text-black hover:text-gray-600 font-bold flex items-center transition duration-150"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver a Inicio
                </button>
                
                {/* Título y Filtros */}
                <h1 className="text-4xl font-serif mb-2">{category || 'Todas las Propiedades'}</h1>
                {searchFilters && (
                    <p className="text-lg text-gray-500 mb-8">
                        Resultados de búsqueda en: {searchFilters.location || 'cualquier lugar'}
                    </p>
                )}
                
                <div className="flex justify-between items-center mb-10 border-b pb-4">
                    <p className="text-gray-700 font-semibold">{properties.length} Propiedad(es) encontrada(s)</p>
                    {/* Aquí iría el componente de ordenamiento o más filtros */}
                </div>

                {/* Cuadrícula de Propiedades */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {properties.map((property) => (
                        <div 
                            key={property.id} 
                            onClick={() => onPropertyClick(property)}
                            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                        >
                            <img 
                                src={property.imageUrl} 
                                alt={property.title} 
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5">
                                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                                    {PropertyType[property.type as keyof typeof PropertyType]}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-2 truncate">
                                    {property.title}
                                </h2>
                                <p className="text-lg font-semibold text-gray-800 mb-3">
                                    {formatPrice(property.price, property.currency)}
                                </p>
                                <div className="flex text-gray-600 text-sm space-x-4">
                                    <span>🛌 {property.bedrooms}</span>
                                    <span>🛁 {property.bathrooms}</span>
                                    <span>📐 {property.area} m²</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 truncate">{property.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                {properties.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500">No se encontraron propiedades que coincidan con los criterios.</p>
                        <button 
                            onClick={() => onNavigate('home')}
                            className="mt-6 text-lg text-black hover:text-gray-700 underline font-semibold"
                        >
                            &larr; Iniciar una nueva búsqueda
                        </button>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default ListingView;
