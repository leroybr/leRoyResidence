// components/ListingView.tsx
import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { PropertyCard } from './PropertyCard'; // Asegúrate de que esta importación sea correcta

// Definiciones de tipos para las props
interface ListingViewProps {
    properties: Property[];
    categoryTitle: string;
    onSelectProperty: (property: Property) => void;
}

// Valores de filtro para los selectores (deben coincidir con types.ts)
const propertyTypeOptions = [
    { value: 'any', label: 'Tipo de Propiedad' },
    ...Object.values(PropertyType).map(type => ({ value: type, label: type }))
];

const priceRangeOptions = [
    { value: 'any', label: 'Cualquier Precio' },
    { value: '0-50000000', label: 'Hasta $50M CLP' },
    { value: '50000001-100000000', label: '$50M - $100M CLP' },
    { value: '100000001-200000000', label: '$100M - $200M CLP' },
    { value: '200000001-500000000', label: '$200M - $500M CLP' },
    { value: '500000001-999999999999', label:'Más de $500M CLP' }
];

const bedroomsOptions = [
    { value: 'any', label: 'Habitaciones' },
    { value: '1+', label: '1+' },
    { value: '2+', label: '2+' },
    { value: '3+', label: '3+' },
    { value: '4+', label: '4+' }
];

// Asumiendo un valor de conversión UF fijo para el filtrado secundario
const UF_VALUE_CLP = 37800; 

const ListingView: React.FC<ListingViewProps> = ({ properties, categoryTitle, onSelectProperty }) => {
    
    // Estados de filtros secundarios
    const [filterType, setFilterType] = useState('any');
    const [filterPrice, setFilterPrice] = useState('any');
    const [filterBedrooms, setFilterBedrooms] = useState('any');
    const [filteredProperties, setFilteredProperties] = useState(properties);
    
    // Efecto para actualizar la lista filtrada cuando cambian las propiedades principales o los filtros
    useEffect(() => {
        let result = properties;

        // --- FILTRO POR TIPO ---
        if (filterType !== 'any') {
            result = result.filter(p => p.type === filterType);
        }

        // --- FILTRO POR DORMITORIOS ---
        if (filterBedrooms !== 'any') {
            const minBedrooms = parseInt(filterBedrooms.replace('+', ''), 10);
            result = result.filter(p => p.bedrooms >= minBedrooms);
        }

        // --- FILTRO POR PRECIO (Complejo: Necesita convertir todo a CLP para comparar) ---
        if (filterPrice !== 'any') {
            const [minStr, maxStr] = filterPrice.split('-');
            const minClp = parseInt(minStr, 10);
            const maxClp = parseInt(maxStr, 10);

            result = result.filter(p => {
                let priceInClp = 0;
                const price = p.price;
                const currency = p.currency.trim();
                
                // Conversión de precio de la propiedad a CLP
                if (currency === 'UF') {
                    priceInClp = price * UF_VALUE_CLP;
                } else if (currency === '$' || currency === 'USD') {
                    // Usar un valor fijo para USD/CLP. Esto es una simplificación.
                    priceInClp = price * 950; 
                } else if (currency === '€' || currency === 'EUR') {
                    // Usar un valor fijo para EUR/CLP.
                    priceInClp = price * 1020; 
                } else {
                    // Asumir que cualquier otra cosa (incluyendo CLP) es el precio nominal
                    priceInClp = price;
                }

                return priceInClp >= minClp && priceInClp <= maxClp;
            });
        }

        setFilteredProperties(result);
    }, [properties, filterType, filterBedrooms, filterPrice]);

    // Manejo de la navegación a la vista de detalles
    const handleCardClick = (property: Property) => {
        onSelectProperty(property);
    };

    return (
        <div className="bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* TÍTULO Y CONTEO */}
                <div className="mb-8">
                    <h2 className="font-serif text-3xl font-light text-leroy-black">{categoryTitle}</h2>
                    <p className="text-gray-500 mt-1">Mostrando {filteredProperties.length} propiedades disponibles</p>
                </div>

                {/* BARRA DE FILTROS SECUNDARIOS */}
                <div className="mb-10 p-4 border border-gray-100 bg-gray-50">
                    <div className="flex flex-wrap gap-4 items-center">
                        
                        {/* Filtro por Tipo */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="p-2 border border-gray-300 text-sm focus:border-leroy-gold focus:ring-leroy-gold appearance-none"
                        >
                            {propertyTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        
                        {/* Filtro por Habitaciones */}
                        <select
                            value={filterBedrooms}
                            onChange={(e) => setFilterBedrooms(e.target.value)}
                            className="p-2 border border-gray-300 text-sm focus:border-leroy-gold focus:ring-leroy-gold appearance-none"
                        >
                            {bedroomsOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        {/* Filtro por Precio */}
                        <select
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                            className="p-2 border border-gray-300 text-sm focus:border-leroy-gold focus:ring-leroy-gold appearance-none"
                        >
                            {priceRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        {/* Botón de Reset */}
                        <button
                            onClick={() => {
                                setFilterType('any');
                                setFilterPrice('any');
                                setFilterBedrooms('any');
                            }}
                            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-leroy-black transition-colors ml-auto"
                        >
                            Restablecer Filtros
                        </button>

                    </div>
                </div>
                
                {/* LISTADO DE PROPIEDADES */}
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProperties.map(property => (
                            <PropertyCard 
                                key={property.id} 
                                property={property} 
                                onClick={() => handleCardClick(property)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border border-gray-100 bg-gray-50 mt-8">
                        <p className="text-xl text-gray-600 font-serif">
                            No se encontraron propiedades que coincidan con sus filtros.
                        </p>
                        <button
                            onClick={() => {
                                setFilterType('any');
                                setFilterPrice('any');
                                setFilterBedrooms('any');
                            }}
                            className="mt-4 text-leroy-gold hover:underline font-bold"
                        >
                            Ver todas las propiedades
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingView;
