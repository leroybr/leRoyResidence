import React, { useState, useEffect } from 'react';
// IMPORTANTE: Debes importar PropertyType y el nuevo tipo HeroSearchState aquí
import { Property, PropertyType, HeroSearchState } from '../types'; 
import { PropertyCard } from './PropertyCard';

interface ListingViewProps {
  category: string;
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onGoHome: () => void;
  onClearFilters: () => void;
  onNavigate: (view: string, category?: string) => void;
  // -------------------------------------------------------------------
  // LÍNEA AÑADIDA PARA RESOLVER EL ERROR TS2322 DE App.tsx
  // -------------------------------------------------------------------
  searchFilters: HeroSearchState | null;
}

const UF_VALUE_CLP = 37800;
const USD_VALUE_CLP = 950;
const EUR_VALUE_CLP = 1020;

const ListingView: React.FC<ListingViewProps> = ({
  category,
  properties,
  onPropertyClick,
  onGoHome,
  onClearFilters,
  onNavigate,
  // -------------------------------------------------------------------
  // DESESTRUCTURAR LA NUEVA PROP
  // -------------------------------------------------------------------
  searchFilters, 
}) => {
  // --- Local Filter State ---
  // Inicializamos los filtros locales con los valores de searchFilters si existen
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterBedrooms, setFilterBedrooms] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // --- Lógica de Inicialización/Reseteo de Filtros ---
  useEffect(() => {
    // 1. Resetear/Inicializar con valores predeterminados (para cambios de categoría)
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    setIsFiltersOpen(false);

    // 2. Aplicar filtros iniciales de Hero (si existen)
    if (searchFilters) {
      // Aquí deberías traducir searchFilters.priceRange y searchFilters.bedrooms
      // a filterMinPrice/filterMaxPrice y filterBedrooms si la lógica de App.tsx no lo hace.
      // Por ahora, mantendremos la inicialización simple para evitar reescribir mucha lógica.
      
      // Nota: La lógica de App.tsx parece aplicar el filtro del Hero directamente a 'properties' 
      // antes de llegar a este componente (la prop 'properties' ya está filtrada).
      // Por lo tanto, aquí sólo necesitamos inicializar los filtros de UI si es necesario.
      // Dado que la lógica local usa `properties` (que ya está filtrada) como base, 
      // la inicialización del estado de UI puede ser omitida o mejorada si la quieres ver reflejada.
    }

  }, [category, searchFilters]); // Dependencia agregada: searchFilters

  // Apply filters logic (esta lógica opera correctamente sobre 'properties')
  useEffect(() => {
    // ... (Tu lógica de filtrado local existente no necesita cambios aquí)
    let result = properties;

    if (filterType !== 'all') {
      // Nota: La comparación debe ser contra los valores del enum, no solo la clave
      // Debes mapear la cadena seleccionada en el select al valor del enum, o usar el valor
      // 'PropertyType.VILLA' si el select usa la clave, o 'Villa' si usa el valor.
      // Asumiendo que el select usa el valor legible (ej: 'Villa', 'Apartamento'):
      result = result.filter(p => p.type === filterType);
    }
    
    // ... el resto de la lógica de filtrado de dormitorios y precio ...
    if (filterBedrooms > 0) {
      result = result.filter(p => p.bedrooms >= filterBedrooms);
    }

    if (filterMinPrice || filterMaxPrice) {
      const min = filterMinPrice ? parseInt(filterMinPrice) : 0;
      const max = filterMaxPrice ? parseInt(filterMaxPrice) : Number.MAX_SAFE_INTEGER;

      result = result.filter(p => {
        let priceInCLP = 0;
        const currency = p.currency.trim();
        
        if (currency === 'UF') priceInCLP = p.price * UF_VALUE_CLP;
        else if (currency === '$' || currency === 'USD') priceInCLP = p.price * USD_VALUE_CLP;
        else if (currency === '€') priceInCLP = p.price * EUR_VALUE_CLP;
        else priceInCLP = p.price;

        return priceInCLP >= min && priceInCLP <= max;
      });
    }

    setFilteredProperties(result);
  }, [properties, filterMinPrice, filterMaxPrice, filterBedrooms, filterType]);


  const handleClearLocalFilters = () => {
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterBedrooms(0);
    setFilterType('all');
    onClearFilters(); 
  };
  
  // --- Title Logic (sin cambios) ---
  let title = category;
  const knownCities = ['Concepción', 'Chiguayante', 'San Pedro de la Paz', 'Talcahuano', 'Coronel', 'Penco', 'Los Ángeles'];
  
  if (knownCities.includes(category)) {
    title = `Propiedades de lujo en ${category}`;
  } else if (category === 'Bienes Raíces') {
    title = 'Propiedades Exclusivas en Venta';
  } else if (category === 'Premium Property') {
    title = 'Colección Premium';
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
      {/* ... (Resto del JSX sin cambios) ... */}
    </div>
  );
};

export default ListingView;
