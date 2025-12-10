import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { PropertyCard } from './components/PropertyCard';
import ListingView from './components/ListingView';
import AdminView from './components/AdminView';
import PropertyDetailView from './components/PropertyDetailView';
import ShowroomView from './components/ShowroomView';
// Importamos MOCK_PROPERTIES solo como fallback, no como estado inicial
// import { MOCK_PROPERTIES } from './constants'; // Ya no se usa como estado inicial
import { Property, HeroSearchState } from './types';

const UF_VALUE_CLP = 37800; // Valor aproximado de la UF en pesos chilenos

const App: React.FC = () => {
  // [CAMBIO CLAVE] Inicializamos el estado de propiedades como array vacío
  const [properties, setProperties] = useState<Property[]>([]); 
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para la carga inicial
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchFilters, setSearchFilters] = useState<HeroSearchState | null>(null);

  // --- NUEVA LÓGICA: Carga de Propiedades desde la API ---
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      // [CAMBIO CLAVE] Llamada al endpoint API para obtener todas las propiedades guardadas
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Error al cargar las propiedades del servidor');
      }
      const data: Property[] = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Fallo al obtener propiedades:", error);
      // Opcional: Usar MOCK_PROPERTIES si la API falla críticamente
      // import { MOCK_PROPERTIES } from './constants';
      // setProperties(MOCK_PROPERTIES); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Lógica de URL/Inicialización ---
  useEffect(() => {
    fetchProperties(); // [CAMBIO CLAVE] Cargar propiedades al inicio
    
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const category = params.get('category');
    
    if (page === 'listing' && category) {
      setCurrentView('listing');
      setSelectedCategory(category);
    } else if (page === 'showroom') {
      setCurrentView('showroom');
    } else if (page === 'admin') {
      setCurrentView('admin');
    }
  }, [fetchProperties]); // Dependencia para asegurar que solo se ejecuta una vez

  // --- Lógica de Título de Página (sin cambios) ---
  useEffect(() => {
    let title = 'LeRoy Residence | Corretaje de Propiedades';

    if (currentView === 'home') title = 'LeRoy Residence | Inicio - Compra y Venta';
    else if (currentView === 'showroom') title = 'Nuevas Tecnologías en Cocina | LeRoy';
    else if (currentView === 'listing') {
      if (selectedCategory === 'premium') title = 'Propiedades Premium | LeRoy';
      else if (selectedCategory === 'bienes-raices') title = 'Bienes Raíces | LeRoy';
      else title = `${selectedCategory} | LeRoy`;
    }
    else if (currentView === 'detail' && selectedProperty) title = `${selectedProperty.title} | LeRoy`;
    else if (currentView === 'admin') title = 'Administración | LeRoy';

    document.title = title;
  }, [currentView, selectedCategory, selectedProperty]);

  // --- Handlers de Navegación y Búsqueda (sin cambios) ---
  const handleNavigate = (view: string, category: string = '') => {
    setCurrentView(view);
    setSelectedCategory(category);
    setSearchFilters(null);
    window.scrollTo(0, 0);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleHeroSearch = (filters: HeroSearchState) => {
    setSearchFilters(filters);
    
    if (filters.location && filters.bedrooms === 'any' && filters.priceRange === 'any') {
        handleNavigate('listing', filters.location);
    } else {
      handleNavigate('listing', 'Resultados de Búsqueda');
    }
  };

  // --- Handlers de Administración (CRUD) - AHORA PERSISTENTES ---
  const handleAddProperty = async (newProperty: Property) => {
    // [CAMBIO CLAVE] Enviar la nueva propiedad a la API usando POST
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty),
      });

      if (response.ok) {
        await fetchProperties(); // Recargar la lista después de la adición
        setCurrentView('admin');
      } else {
        console.error('Error al agregar propiedad:', await response.text());
        alert('Error: No se pudo agregar la propiedad en el servidor.');
      }
    } catch (error) {
      console.error('Fallo en la conexión de la API (POST):', error);
      alert('Error de conexión con el servidor. Verifique la API.');
    }
  };

  const handleUpdateProperty = async (updatedProperty: Property) => {
    // [CAMBIO CLAVE] Enviar la propiedad actualizada a la API usando PUT
    try {
      const response = await fetch(`/api/properties?id=${updatedProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProperty),
      });

      if (response.ok) {
        await fetchProperties(); // Recargar la lista después de la actualización
        setCurrentView('admin');
      } else {
        console.error('Error al actualizar propiedad:', await response.text());
        alert('Error: No se pudo actualizar la propiedad en el servidor.');
      }
    } catch (error) {
      console.error('Fallo en la conexión de la API (PUT):', error);
      alert('Error de conexión con el servidor. Verifique la API.');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    // [CAMBIO CLAVE] Enviar solicitud de eliminación a la API usando DELETE
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) return;

    try {
      const response = await fetch(`/api/properties?id=${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProperties(); // Recargar la lista después de la eliminación
        setCurrentView('admin');
      } else {
        console.error('Error al eliminar propiedad:', await response.text());
        alert('Error: No se pudo eliminar la propiedad en el servidor.');
      }
    } catch (error) {
      console.error('Fallo en la conexión de la API (DELETE):', error);
      alert('Error de conexión con el servidor. Verifique la API.');
    }
  };
  // --- Fin Handlers de Administración (CRUD) ---

  // --- Lógica de Filtrado de Propiedades (sin cambios, usa el nuevo estado 'properties') ---
  const getFilteredProperties = () => {
    let filtered = properties;

    // Aplicar filtro de publicación: Si NO estamos en admin, solo mostrar publicadas
    if (currentView !== 'admin') {
        filtered = filtered.filter(p => p.isPublished);
    }

    // ... (resto de la lógica de filtrado es la misma) ...
    if (selectedCategory && selectedCategory !== 'Resultados de Búsqueda') {
      if (selectedCategory === 'Bienes Raíces' || selectedCategory === 'Desarrollos') {
        // No hay filtro de categoría, solo se usan los filtros de búsqueda si existen
      } else if (selectedCategory === 'Premium Property') {
          filtered = filtered.filter(p => p.isPremium);
      } else {
        filtered = filtered.filter(p => p.location.includes(selectedCategory));
      }
    }

    if (searchFilters) {
      if (searchFilters.location) {
        filtered = filtered.filter(p => p.location.includes(searchFilters.location));
      }
      if (searchFilters.bedrooms !== 'any') {
        const minBeds = parseInt(searchFilters.bedrooms);
        filtered = filtered.filter(p => p.bedrooms >= minBeds);
      }
      if (searchFilters.priceRange !== 'any') {
        const [minStr, maxStr] = searchFilters.priceRange.split('-');
        let min = parseInt(minStr);
        let max = maxStr === 'plus' ? Number.MAX_SAFE_INTEGER : parseInt(maxStr);

        filtered = filtered.filter(p => {
            let priceInCLP = 0;
            const currency = p.currency.trim();
            
            // Asumimos un tipo de cambio fijo para el filtro (solo para el mock)
            if (currency === 'UF') priceInCLP = p.price * UF_VALUE_CLP;
            else if (currency === '$' || currency === 'USD') priceInCLP = p.price * 950;
            else if (currency === '€') priceInCLP = p.price * 1020;
            else priceInCLP = p.price; 
            
            return priceInCLP >= min && priceInCLP <= max;
        });
      }
    }

    return filtered;
  };
  // --- Fin Lógica de Filtrado ---

  // --- LÓGICA DE RENDERIZADO (Con manejo de carga) ---
  const renderContent = () => {
    if (isLoading && currentView !== 'admin') {
      return <p className="text-center mt-32 text-xl text-gray-700">Cargando propiedades...</p>;
    }
    
    const filteredProperties = getFilteredProperties();
    
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleHeroSearch} onNavigate={handleNavigate} />
            <div className="bg-white py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif text-leroy-black mb-8 text-center">Propiedades Destacadas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredProperties
                    .filter(p => p.isPremium && p.isPublished)
                    .slice(0, 3)
                    .map(property => (
                      <PropertyCard 
                        key={property.id} 
                        property={property} 
                        onClick={() => handlePropertyClick(property)}
                      />
                    ))}
                </div>
                {filteredProperties.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">No hay propiedades destacadas disponibles.</p>
                )}
              </div>
            </div>
          </>
        );

      case 'listing':
        return (
          <ListingView 
            properties={filteredProperties} 
            category={selectedCategory}
            searchFilters={searchFilters}
            onPropertyClick={handlePropertyClick} 
          />
        );

      case 'detail':
        if (!selectedProperty) return <p className="text-center mt-20">Propiedad no encontrada.</p>;
        return (
          <PropertyDetailView 
            property={selectedProperty} 
            onNavigate={handleNavigate} 
          />
        );

      case 'showroom':
        return <ShowroomView onNavigate={handleNavigate} />;

      case 'admin':
        return (
          <AdminView 
            properties={properties} // Pasar todas las propiedades, incluyendo borradores
            onAddProperty={handleAddProperty} 
            onUpdateProperty={handleUpdateProperty} 
            onDeleteProperty={handleDeleteProperty} 
            onCancel={() => handleNavigate('home')} 
          />
        );

      default:
        return (
          <div className="text-center mt-32 h-64">
            <h1 className="text-4xl font-serif text-red-600">404</h1>
            <p className="text-gray-600">Vista no encontrada.</p>
            <button onClick={() => handleNavigate('home')} className="mt-4 text-leroy-black hover:underline">
              Volver al Inicio
            </button>
        );
    }
  };
  // --- FIN LÓGICA DE RENDERIZADO ---

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
