
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ListingView from './components/ListingView';
import AdminView from './components/AdminView';
import AdminLoginView from './components/AdminLoginView';
import PropertyDetailView from './components/PropertyDetailView';
import ShowroomView from './components/ShowroomView';
import { Property, HeroSearchState } from './types';
import { MOCK_PROPERTIES } from './constants';
import { interpretSearchQuery } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'real_estate' | 'admin' | 'detail' | 'showroom_kitchens'>('home');
  
  // Persistencia: Cargar propiedades desde LocalStorage al iniciar
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('leroy_properties_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_PROPERTIES;
      }
    }
    return MOCK_PROPERTIES;
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);

  // Guardar propiedades cada vez que cambien
  useEffect(() => {
    localStorage.setItem('leroy_properties_v1', JSON.stringify(properties));
  }, [properties]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedPropertyId]);

  const handleSearch = async (searchState: HeroSearchState) => {
    setIsSearching(true);
    try {
      const filters = await interpretSearchQuery(searchState.location);
      console.log('Filtros interpretados por IA:', filters);
      setView('real_estate');
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setView('real_estate');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickLink = (label: string) => {
    if (label === 'Casas espectaculares') {
      navigateToDetail('espectacular-1');
    } else if (label === 'Decoraciones') {
      setView('showroom_kitchens');
    } else {
      setView('real_estate');
    }
  };

  const navigateToDetail = (id: string) => {
    setSelectedPropertyId(id);
    setView('detail');
  };

  const handleAddProperty = (newProp: Property) => {
    setProperties([newProp, ...properties]);
    setView('real_estate');
  };

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setView('admin');
    } else {
      setView('admin');
    }
  };

  const handleSecureLogout = () => {
    setIsAdminAuthenticated(false);
    setIsConfirmingLogout(false);
    setView('home');
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const getHeaderView = (): 'home' | 'listing' | 'admin' | 'detail' | 'showroom' => {
    if (view === 'showroom_kitchens') return 'showroom';
    if (view === 'real_estate') return 'listing';
    if (view === 'admin') return 'admin';
    return view as 'home' | 'detail';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onNavigate={(v: any) => v === 'admin' ? handleAdminAccess() : setView(v)} 
        currentView={getHeaderView()} 
      />
      
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero onSearch={handleSearch} onQuickLinkClick={handleQuickLink} isSearching={isSearching} />
            <section className="py-24 max-w-7xl mx-auto px-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-serif mb-4">Propiedades Destacadas</h2>
                  <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Nuestra selección exclusiva de esta semana</p>
                </div>
                <button 
                  onClick={() => setView('real_estate')}
                  className="text-xs font-bold uppercase tracking-widest border-b-2 border-leroy-orange pb-1 hover:text-leroy-orange transition-colors"
                >
                  Ver todo el catálogo
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {properties.slice(0, 3).map(p => (
                  <div key={p.id} className="fade-in">
                    <div onClick={() => navigateToDetail(p.id)} className="cursor-pointer group">
                      <div className="aspect-[4/5] overflow-hidden mb-6">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </div>
                      <h3 className="font-serif text-2xl mb-1 group-hover:text-leroy-orange transition-colors">{p.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'real_estate' && (
          <ListingView 
            category="real_estate" 
            properties={properties} 
            onClearFilters={() => {}} 
            onPropertyClick={navigateToDetail}
            onGoHome={() => setView('home')}
          />
        )}

        {view === 'admin' && (
          !isAdminAuthenticated ? (
            <AdminLoginView 
              onSuccess={() => setIsAdminAuthenticated(true)} 
              onCancel={() => setView('home')} 
            />
          ) : (
            <>
              <AdminView 
                onAddProperty={handleAddProperty} 
                onCancel={() => setIsConfirmingLogout(true)} 
              />
              {isConfirmingLogout && (
                <AdminLoginView 
                  mode="logout"
                  onSuccess={handleSecureLogout} 
                  onCancel={() => setIsConfirmingLogout(false)} 
                />
              )}
            </>
          )
        )}

        {view === 'detail' && selectedProperty && (
          <PropertyDetailView 
            property={selectedProperty} 
            onGoHome={() => setView('home')} 
          />
        )}

        {view === 'showroom_kitchens' && (
          <ShowroomView onGoHome={() => setView('home')} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;

