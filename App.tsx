import React, { useState } from 'react';
import { propertiesData } from './data/properties';
import { Property } from './types';
import ListingView from './components/ListingView';
import Home from './components/Home';
import PropertyView from './components/PropertyView';

function App() {
  const [view, setView] = useState<'home' | 'listing' | 'property'>('home');
  const [selectedCategory, setSelectedCategory] = useState('Bienes Raíces');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleNavigate = (newView: 'home' | 'listing' | 'property', category?: string) => {
    if (category) setSelectedCategory(category);
    setView(newView);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setView('property');
  };

  const getFilteredProperties = () => {
    return propertiesData.filter((p) => p.category === selectedCategory);
  };

  return (
    <div className="min-h-screen w-full">

      {view === 'home' && (
        <Home
          onSelectCategory={(cat) => handleNavigate('listing', cat)}
        />
      )}

      {view === 'listing' && (
        <ListingView
          category={selectedCategory}
          properties={getFilteredProperties()}
          onPropertyClick={handlePropertyClick}
          onGoHome={() => handleNavigate('home')}
          onClearFilters={() => handleNavigate('listing', 'Bienes Raíces')}
        />
      )}

      {view === 'property' && selectedProperty && (
        <PropertyView
          property={selectedProperty}
          onGoBack={() => handleNavigate('listing', selectedCategory)}
          onGoHome={() => handleNavigate('home')}
        />
      )}

    </div>
  );
}

export default App;
