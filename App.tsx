import React, { useState, useEffect, useMemo } from 'react';
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

type ViewState = 'home' | 'listing' | 'admin' | 'detail' | 'showroom';
const UF_VALUE_CLP = 37800;

const App: React.FC = () => {
  // --- LÓGICA DE DATOS ---
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('leroy_properties_db');
    return saved ? JSON.parse(saved) : MOCK_PROPERTIES;
  });
  
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(properties);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Determina si ves botones de gestión

  // Persistencia automática
  useEffect(() => {
    localStorage.setItem('leroy_properties_db', JSON.stringify(properties));
  }, [properties]);

  // --- LÓGICA DE GESTIÓN (Apto para manejo fácil) ---
  
  const handleAddProperty = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
    setIsAdmin(false); // Vuelve a vista normal tras agregar
    handleNavigate('home');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar esta propiedad permanentemente?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, status: p.status === 'Available' ? 'Archived' : 'Available' } : p
    ));
  };

  // --- NAVEGACIÓN Y FILTROS ---

  const handleNavigate = (pageId: string) => {
    window.scrollTo(0, 0);
    setIsAdmin(pageId === 'admin');
    
    if (pageId === 'admin') {
      setCurrentView('admin');
      return;
    }

    if (pageId === 'home') {
      setCurrentView('home');
      setCurrentCategory('');
      return;
    }

    // Filtrado por categoría/comuna (Solo muestra 'Available' al público)
    setCurrentView('listing');
    setCurrentCategory(pageId);
    
    let base = properties;
    if (pageId === 'premium') {
      base = base.filter(p => p.isPremium);
    } else if (pageId !== 'real_estate' && pageId !== 'developments') {
      base = base.filter(p => p.location.toLowerCase().includes(pageId.toLowerCase()));
    }
    
    // Si no es admin, oculta las archivadas
    setDisplayedProperties(base.filter(p => p.status === 'Available'));
  };

  const handlePropertyClick = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      setCurrentView('detail');
    }
  };

  // --- RENDERIZADO DE INTERFAZ ---

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header 
        onNavigate={handleNavigate} 
        currentView={currentView === 'detail' || currentView === 'showroom' ? 'listing' : currentView} 
      />
      
      <main className="flex-grow">
        {currentView === 'admin' ? (
          <AdminView onAddProperty={handleAddProperty} onCancel={() => handleNavigate('home')} />
        ) : currentView === 'detail' && selectedProperty ? (
          <PropertyDetailView property={selectedProperty} onGoHome={() => handleNavigate('home')} />
        ) : currentView === 'showroom' ? (
          <ShowroomView onGoHome={() => handleNavigate('home')} />
        ) : currentView === 'home' ? (
          <>
            <Hero onSearch={() => {}} isSearching={false} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl text-
