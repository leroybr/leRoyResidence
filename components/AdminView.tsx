import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { COMMUNES } from '../constants';

interface AdminViewProps {
  onAddProperty: (property: Property) => void;
  onUpdateProperty?: (property: Property) => void;
  onDeleteProperty?: (propertyId: string) => void; // Si lo usas, si no, elimina esta línea
  onCancel: () => void;
  properties?: Property[];
}

const COMMON_AMENITIES = [
  'Seguridad 24/7', 'Piscina Privada', 'Piscina Temperada', 'Quincho / BBQ', 
  'Jardines', 'Estacionamiento', 'Vista Panorámica', 'Calefacción Central', 
  'Bodega', 'Gimnasio', 'Spa', 'Domótica', 'Cava de Vinos', 'Cine en Casa'
];

const AdminView: React.FC<AdminViewProps> = ({ onAddProperty, onCancel, properties = [], onUpdateProperty }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('manage');

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState(COMMUNES[0]);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('UF'); 
  const [type, setType] = useState<PropertyType>(PropertyType.VILLA);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false); 
  const [status, setStatus] = useState<'published' | 'paused'>('published');

  // Private Data State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [legalDescription, setLegalDescription] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
        setIsAuthenticated(true);
    } else {
        setLoginError('Contraseña incorrecta');
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleToggleStatus = (property: Property) => {
    if (!onUpdateProperty) return;
    const currentStatus = property.status || 'published';
    const newStatus = currentStatus === 'paused' ? 'published' : 'paused';
    onUpdateProperty({ ...property, status: newStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProperty: Property = {
      id: `custom-${Date.now()}`,
      title,
      subtitle: subtitle || title,
      location: `${location}, Chile`,
      price,
      currency,
      type,
      bedrooms,
      bathrooms,
      area,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop', 
      description,
      amenities: selectedAmenities,
      isPremium,
      status,
      privateData: {
        ownerName,
        ownerPhone,
        legalDescription,
        privateNotes
      }
    };

    onAddProperty(newProperty);
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-20">
            <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl max-w-md w-full text-center border-t-4 border-leroy-black">
                <div className="mb-6 flex justify-center">
                    <div className="font-serif font-semibold tracking-tighter flex items-baseline text-leroy-black select-none opacity-50">
                        <span className="text-2xl">L</span>
                        <span className="text-xl">e</span>
                        <span className="text-2xl -ml-0.5">R</span>
                    </div>
                </div>
                <h2 className="font-serif text-2xl text-leroy-black mb-2">Acceso Restringido</h2>
                <p className="text-gray-500 text-sm mb-8 font-sans">Área exclusiva para administradores.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setLoginError('');
                        }}
                        placeholder="Contraseña"
                        className="w-full border border-gray-300 p-3 text-sm focus:border-leroy-gold focus:outline-none transition-colors rounded-none placeholder-gray-300"
                        autoFocus
                    />
                    {loginError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">{loginError}</p>}
                    
                    <button type="submit" className="w-full bg-leroy-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-leroy-gold transition-colors duration-300">
                        Ingresar
                    </button>
                </form>

                <button onClick={onCancel} className="mt-8 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-black transition-colors">
                    Volver al sitio
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Resto del código */}
        {/* ... */}
      </div>
    </div>
  );
};

export default AdminView;
