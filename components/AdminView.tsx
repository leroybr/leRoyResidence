import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { COMMUNES } from '../constants';

interface AdminViewProps {
  onAddProperty: (property: Property) => void;
  onUpdateProperty?: (property: Property) => void;
  onCancel: () => void;
  properties?: Property[]; // New prop for managing inventory
}

const COMMON_AMENITIES = [
  'Seguridad 24/7', 'Piscina Privada', 'Piscina Temperada', 'Quincho / BBQ', 
  'Jardines', 'Estacionamiento', 'Vista Panorámica', 'Calefacción Central', 
  'Bodega', 'Gimnasio', 'Spa', 'Domótica', 'Cava de Vinos', 'Cine en Casa'
];

const AdminView: React.FC<AdminViewProps> = ({ onAddProperty, onCancel, properties = [], onUpdateProperty }) => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // --- View State (New vs Manage) ---
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('manage');

  // --- Public Data State (For New Property) ---
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

  // --- Private Data State ---
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
    const newStatus = property.status === 'paused' ? 'published' : 'paused';
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
      status, // Use the selected status
      privateData: {
        ownerName,
        ownerPhone,
        legalDescription,
        privateNotes
      }
    };

    onAddProperty(newProperty);
  };

  // --- Render Login Screen if not authenticated ---
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

  // --- Render Admin Dashboard ---
  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="font-serif text-3xl text-leroy-black mb-2">Panel de Administración</h1>
              <p className="text-gray-500 text-sm">Gestione su inventario y publique nuevas propiedades.</p>
          </div>
          <button onClick={onCancel} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-leroy-black">
            Cerrar Sesión
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8">
            <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'manage' ? 'bg-white text-leroy-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Inventario
            </button>
            <button 
                onClick={() => setActiveTab('new')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${activeTab === 'new' ? 'bg-white text-leroy-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Crear Propiedad
            </button>
        </div>

        {activeTab === 'manage' ? (
            /* --- INVENTORY MANAGEMENT TAB --- */
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <th className="p-4">Propiedad</th>
                                <th className="p-4">Ubicación</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {properties.map(prop => (
                                <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={prop.imageUrl} alt="" className="w-12 h-12 object-cover rounded-sm bg-gray-200" />
                                            <div>
                                                <p className="font-serif text-sm text-leroy-black font-semibold truncate max-w-[200px]">{prop.title}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{prop.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{prop.location}</td>
                                    <td className="p-4 text-sm font-bold text-gray-800">
                                        {prop.currency} {prop.price.toLocaleString('es-CL')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${prop.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {prop.status === 'paused' ? 'En Pausa' : 'Publicada'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleToggleStatus(prop)}
                                            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border transition-colors ${
                                                prop.status === 'paused' 
                                                ? 'border-green-600 text-green-600 hover:bg-green-50' 
                                                : 'border-yellow-600 text-yellow-600 hover:bg-yellow-50'
                                            }`}
                                        >
                                            {prop.status === 'paused' ? 'Publicar' : 'Pausar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            /* --- NEW PROPERTY FORM TAB --- */
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
            
            {/* Public Data Section */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center border-b pb-2 mb-6">
                    <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-leroy-gold">
                    Datos Públicos
                    </h2>
                    
                    <div className="flex items-center gap-6">
                        {/* Status Toggle for New Property */}
                        <div className="flex items-center gap-2">
                             <label className="text-xs font-bold uppercase text-gray-500">Estado Inicial:</label>
                             <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value as 'published' | 'paused')}
                                className="text-xs border-gray-300 rounded focus:ring-0 focus:border-leroy-black"
                             >
                                <option value="published">Publicada</option>
                                <option value="paused">En Pausa (Borrador)</option>
                             </select>
                        </div>

                        {/* Premium Toggle */}
                        <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <span className="text-xs font-bold uppercase tracking-widest text-leroy-black">Premium</span>
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={isPremium} 
                                    onChange={(e) => setIsPremium(e.target.checked)} 
                                    className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-leroy-gold"></div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Título Principal</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0" placeholder="Ej: Espectacular Casa en El Venado" />
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subtítulo / Bajada</label>
                    <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0" placeholder="Ej: Propiedad heredada poco común en las fincas..." />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ubicación</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0">
                    {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tipo</label>
                    <select value={type} onChange={e => setType(e.target.value as PropertyType)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0">
                    {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Precio</label>
                    <input required type="number" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Moneda</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm focus:border-leroy-gold focus:ring-0">
                    <option value="UF">UF</option>
                    <option value="$">Pesos (CLP)</option>
                    <option value="USD">Dólares (USD)</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4 col-span-2 md:col-span-1">
                    <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Dormitorios</label>
                    <input type="number" min="0" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm" />
                    </div>
                    <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Baños</label>
                    <input type="number" min="0" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm" />
                    </div>
                    <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">M2 Totales</label>
                    <input type="number" min="0" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm" />
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">URL Imagen</label>
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm" placeholder="https://..." />
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripción</label>
                    <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-200 bg-gray-50 p-3 rounded text-sm"></textarea>
                </div>

                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {COMMON_AMENITIES.map(amenity => (
                        <label key={amenity} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                            <input 
                            type="checkbox" 
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded text-leroy-black focus:ring-0" 
                            />
                            <span>{amenity}</span>
                        </label>
                        ))}
                    </div>
                </div>
                </div>
            </div>

            {/* Private Data Section */}
            <div className="bg-red-50 p-8 rounded-lg shadow-sm border border-red-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-100 px-3 py-1 rounded-bl-lg text-[10px] font-bold text-red-800 uppercase tracking-widest">
                Confidencial
                </div>
                <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-red-800 mb-6 border-b border-red-200 pb-2">
                Datos Privados
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Nombre Propietario</label>
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full border-red-100 bg-white p-3 rounded text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Teléfono</label>
                    <input type="text" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} className="w-full border-red-100 bg-white p-3 rounded text-sm" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Datos Legales</label>
                    <input type="text" value={legalDescription} onChange={e => setLegalDescription(e.target.value)} className="w-full border-red-100 bg-white p-3 rounded text-sm" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Notas Internas</label>
                    <textarea rows={3} value={privateNotes} onChange={e => setPrivateNotes(e.target.value)} className="w-full border-red-100 bg-white p-3 rounded text-sm"></textarea>
                </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-leroy-black text-white px-10 py-4 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">
                Guardar Propiedad
                </button>
            </div>

            </form>
        )}
      </div>
    </div>
  );
};

export default AdminView;
