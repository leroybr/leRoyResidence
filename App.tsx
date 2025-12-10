import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { PropertyCard } from './components/PropertyCard';
import ListingView from './components/ListingView';
import AdminView from './components/AdminView';
import PropertyDetailView from './components/PropertyDetailView';
import ShowroomView from './components/ShowroomView';
import { MOCK_PROPERTIES } from './constants';
import { Property, HeroSearchState } from './types';

const UF_VALUE_CLP = 37800;

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchFilters, setSearchFilters] = useState<HeroSearchState | null>(null);

  useEffect(() => {
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
  }, []);

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

  const handleAddProperty = (newProperty: Property) => {
    const updatedProperties = [newProperty, ...properties];
    setProperties(updatedProperties);
    handleNavigate('listing', 'Bienes Raíces');
  };

  // ✨ INICIO DE CAMBIOS PARA EDICIÓN Y GESTIÓN ✨
  
  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties(prevProperties => 
      prevProperties.map(p => 
        p.id === updatedProperty.id ? updatedProperty : p
      )
    );
    setCurrentView('admin'); // Volver a la vista de administración después de guardar
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prevProperties => prevProperties.filter(p => p.id !== propertyId));
    setCurrentView('admin'); // Quedarse en la vista de administración
  };

  // ✨ FIN DE CAMBIOS PARA EDICIÓN Y GESTIÓN ✨

  const getFilteredProperties = () => {
    let filtered = properties;

    // Aplicar filtro de publicación: Si NO estamos en admin, solo mostrar publicadas
    if (currentView !== 'admin') {
        filtered = filtered.filter(p => p.isPublished);
    }

    if (selectedCategory && selectedCategory !== 'Resultados de Búsqueda') {
      if (selectedCategory === 'Bienes Raíces' || selectedCategory === 'Desarrollos') {
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

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
