
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import ListingView from './components/ListingView';
import AdminView from './components/AdminView';
import PropertyDetailView from './components/PropertyDetailView';
import ShowroomView from './components/ShowroomView';
import { MOCK_PROPERTIES } from './constants';
import { Property, HeroSearchState } from './types';
import { interpretSearchQuery } from './services/geminiService';

type ViewState = 'home' | 'listing' | 'admin' | 'detail' | 'showroom';

const UF_VALUE_CLP = 37800; // Consistent with PropertyCard

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(MOCK_PROPERTIES); 
  const [isSearching, setIsSearching] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sync initial MOCK properties to displayed
  useEffect(() => {
     if (currentView === 'home' && !isSearching) {
        setDisplayedProperties(properties);
     }
  }, [properties, currentView, isSearching]);

  const handleSearch = async (filters: HeroSearchState) => {
    const { location, bedrooms, priceRange } = filters;

    // 1. If nothing selected, go home or stay home
    if (!location && bedrooms === 'any' && priceRange === 'any') {
      handleNavigate('home');
      return;
    }
    
    // 2. Optimization: If ONLY location is selected (no specific beds/price), 
    // treat it exactly like clicking the city name in the menu.
    if (location && bedrooms === 'any' && priceRange === 'any') {
        handleNavigate(location);
        return;
    }

    // 3. Complex Search (Location + Beds + Price)
    setCurrentView('listing');
    setIsSearching(true);

    // Create a readable title for the results page
    let titleParts = [];
    if (location) titleParts.push(location);
    if (bedrooms !== 'any') titleParts.push(`${bedrooms}+ Dorm`);
    if (priceRange !== 'any') titleParts.push('Precio Filtrado');
    
    // Set the category title to the search terms
    const searchTitle = titleParts.length > 0 ? titleParts.join(', ') : 'Resultados de Búsqueda';
    setCurrentCategory(searchTitle);

    let filtered = properties;

    // Filter by Location
    if (location.trim()) {
        filtered = filtered.filter(p => 
            p.location.toLowerCase().includes(location.toLowerCase()) ||
            p.title.toLowerCase().includes(location.toLowerCase())
        );
    }

    // Filter by Bedrooms
    if (bedrooms !== 'any') {
        const minBeds = parseInt(bedrooms);
        filtered = filtered.filter(p => p.bedrooms >= minBeds);
    }

    // Filter by Price
    if (priceRange !== 'any') {
        const [minStr, maxStr] = priceRange.split('-');
        let min = parseInt(minStr);
        let max = maxStr === 'plus' ? Number.MAX_SAFE_INTEGER : parseInt(maxStr);

        filtered = filtered.filter(p => {
            let priceInCLP = 0;
            const currency = p.currency.trim();
            
            // Normalize everything to CLP for comparison
            if (currency === 'UF') {
                priceInCLP = p.price * UF_VALUE_CLP;
            } else if (currency === '$' || currency === 'USD') {
                priceInCLP = p.price * 950; 
            } else if (currency === '€') {
                priceInCLP = p.price * 1020; 
            } else {
                priceInCLP = p.price; 
            }
            return priceInCLP >= min && priceInCLP <= max;
        });
    }

    // (Optional) Gemini AI hook for natural language, not used in structured search
    if (location.split(' ').length > 3) {
         const aiFilters = await interpretSearchQuery(location);
    }

    setDisplayedProperties(filtered);
    setIsSearching(false);
  };

  const handleNavigate = (pageId: string) => {
    window.scrollTo(0, 0);
    
    if (pageId === 'admin') {
      setCurrentView('admin');
      return;
    }

    if (pageId === 'home') {
      setCurrentView('home');
      setDisplayedProperties(properties);
      setCurrentCategory('');
      return;
    }

    if (pageId === 'showroom_kitchens') {
      setCurrentView('showroom');
      return;
    }

    setCurrentView('listing');
    setCurrentCategory(pageId);

    if (pageId === 'real_estate' || pageId === 'developments') {
       // Show all properties or specific ones.
       setDisplayedProperties(properties);
    } else if (pageId === 'premium') {
       // Premium Logic: Filter explicitly marked premium properties
       const filtered = properties.filter(p => p.isPremium);
       setDisplayedProperties(filtered);
    } else {
       // It's a location/commune
       // We filter loosely to match "Concepción" in "Concepción, Chile"
       const filtered = properties.filter(p => 
         p.location.toLowerCase().includes(pageId.toLowerCase())
       );
       setDisplayedProperties(filtered);
    }
  };

  const handlePropertyClick = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setCurrentView('detail');
      window.scrollTo(0, 0);
    }
  };

  const handleAddProperty = (newProperty: Property) => {
    const updatedProperties = [newProperty, ...properties];
    setProperties(updatedProperties);
    setDisplayedProperties(updatedProperties); 
    handleNavigate('real_estate'); 
  };

  const clearFilters = () => {
    handleNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header onNavigate={handleNavigate} currentView={currentView === 'detail' || currentView === 'showroom' ? 'listing' : currentView} />
      
      <main className="flex-grow">
        
        {currentView === 'admin' ? (
          <AdminView onAddProperty={handleAddProperty} onCancel={() => handleNavigate('home')} />
        ) : currentView === 'detail' && selectedProperty ? (
          <PropertyDetailView property={selectedProperty} onGoHome={() => handleNavigate('home')} />
        ) : currentView === 'showroom' ? (
          <ShowroomView onGoHome={() => handleNavigate('home')} />
        ) : currentView === 'home' ? (
          <>
            <Hero onSearch={handleSearch} isSearching={isSearching} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl text-leroy-black mb-2">
                    Propiedades Destacadas
                  </h2>
                  <p className="text-gray-500 font-light">
                    Una selección curada de las mejores residencias disponibles.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                   <button 
                     onClick={() => handleNavigate('real_estate')}
                     className="text-xs font-bold uppercase tracking-widest text-leroy-black hover:opacity-70"
                   >
                     Ver todas las propiedades &rarr;
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {properties.slice(0, 6).map(property => (
                  <div key={property.id} className="h-full">
                    <PropertyCard property={property} onClick={handlePropertyClick} />
                  </div>
                ))}
              </div>

            </div>
            
            <section className="bg-gray-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1">
                    <img 
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
                      alt="Luxury Living" 
                      className="w-full h-auto shadow-xl"
                    />
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="font-serif text-3xl md:text-4xl mb-6">El arte de vivir bien.</h3>
                    <p className="text-gray-500 leading-relaxed mb-8">
                      En LeRoy Residence, entendemos que una casa es más que una estructura; es un estilo de vida. 
                      Nuestro equipo de expertos selecciona meticulosamente cada propiedad para garantizar que cumpla 
                      con los estándares más exigentes de calidad, ubicación y diseño.
                    </p>
                    <a href="#" className="inline-block border-b border-leroy-black pb-1 text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">
                      Leer nuestra revista
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <ListingView 
            category={currentCategory} 
            properties={displayedProperties} 
            onClearFilters={clearFilters}
            onPropertyClick={handlePropertyClick}
            onGoHome={() => handleNavigate('home')}
          />
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;
