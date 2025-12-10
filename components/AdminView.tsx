import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { COMMUNES } from '../constants';

const ADMIN_PASSWORD = 'C4s4sL3r0y!2026';

// Interfaz de Propiedades de AdminView (ACTUALIZADA para gestión completa)
interface AdminViewProps {
  properties: Property[]; // Lista de todas las propiedades (para la tabla)
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void; // Para guardar cambios
  onDeleteProperty: (id: string) => void;         // Para eliminar
  onCancel: () => void;
}

const COMMON_AMENITIES = [
  'Seguridad 24/7', 'Piscina Privada', 'Piscina Temperada', 'Quincho / BBQ',
  'Jardines', 'Estacionamiento', 'Vista Panorámica', 'Calefacción Central',
  'Bodega', 'Gimnasio', 'Spa', 'Domótica', 'Cava de Vinos', 'Cine en Casa'
];

const AdminView: React.FC<AdminViewProps> = ({ 
  properties, 
  onAddProperty, 
  onUpdateProperty, 
  onDeleteProperty, 
  onCancel 
}) => {
  
  // 1. Estados de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  // ✨ ESTADOS DE EDICIÓN / GESTIÓN
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isNewProperty, setIsNewProperty] = useState(false); 
  
  // 2. Estados del Formulario (se usan para edición y adición)
  const [id, setId] = useState<string | null>(null); 
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
  const [isPublished, setIsPublished] = useState(false); 
  
  // Private Data State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [legalDescription, setLegalDescription] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  
  // Función para resetear todos los estados del formulario a vacío/default
  const resetForm = () => {
    setEditingProperty(null);
    setIsNewProperty(false);
    setId(null);
    setTitle('');
    setSubtitle('');
    setLocation(COMMUNES[0]);
    setPrice(0);
    setCurrency('UF');
    setType(PropertyType.VILLA);
    setBedrooms(1);
    setBathrooms(1);
    setArea(0);
    setImageUrl('');
    setDescription('');
    setSelectedAmenities([]);
    setIsPremium(false);
    setIsPublished(false);
    setOwnerName('');
    setOwnerPhone('');
    setLegalDescription('');
    setPrivateNotes('');
  };
  
  // useEffect: Precarga datos al entrar en modo edición
  useEffect(() => {
      if (editingProperty) {
          setId(editingProperty.id);
          setTitle(editingProperty.title);
          setSubtitle(editingProperty.subtitle);
          // Aseguramos que la ubicación sea solo la comuna (sin ', Chile')
          setLocation(editingProperty.location.split(',')[0].trim()); 
          setPrice(editingProperty.price);
          setCurrency(editingProperty.currency);
          setType(editingProperty.type);
          setBedrooms(editingProperty.bedrooms);
          setBathrooms(editingProperty.bathrooms);
          setArea(editingProperty.area);
          setImageUrl(editingProperty.imageUrl);
          setDescription(editingProperty.description);
          setSelectedAmenities(editingProperty.amenities);
          setIsPremium(editingProperty.isPremium);
          setIsPublished(editingProperty.isPublished);
          setOwnerName(editingProperty.privateData.ownerName);
          setOwnerPhone(editingProperty.privateData.ownerPhone);
          setLegalDescription(editingProperty.privateData.legalDescription);
          setPrivateNotes(editingProperty.privateData.privateNotes);
          setIsNewProperty(false);
      } else if (isNewProperty) {
          // Si es propiedad nueva, reseteamos asegurando que el id es null
          resetForm();
          setIsNewProperty(true);
      }
  }, [editingProperty, isNewProperty]);
  
  
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setPasswordInput('');
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
      setPasswordInput('');
    }
  };
  
  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Lógica de Envío del Formulario (Añadir O Actualizar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return; 

    const propertyData: Property = {
      id: id || `custom-${Date.now()}`, // Usa el ID existente o genera uno nuevo
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
      isPublished, 
      privateData: {
        ownerName,
        ownerPhone,
        legalDescription,
        privateNotes
      }
    };

    if (id) {
        // MODO EDICIÓN: Llama a la función de actualización
        onUpdateProperty(propertyData); 
    } else {
        // MODO NUEVO: Llama a la función de adición
        onAddProperty(propertyData);
    }
    
    resetForm(); // Limpia el formulario y sale del modo edición/creación
  };
  
  // Funciones de control de la tabla
  const handleEdit = (property: Property) => {
      setEditingProperty(property); // Carga los datos al useEffect
      setIsNewProperty(false); // Aseguramos que no es nueva
  };
  
  const handleCreateNew = () => {
      resetForm();
      setIsNewProperty(true); // Entra en modo creación
  };

  const handleDelete = (propertyId: string) => {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción es permanente.')) {
          onDeleteProperty(propertyId);
      }
  };
  
  // -----------------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // -----------------------------------------------------------

  if (!isAuthenticated) {
    // PANTALLA DE LOGIN
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full">
                <h2 className="font-serif text-2xl text-center text-leroy-black mb-6">Acceso a Administración</h2>
                <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Contraseña Maestra"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-leroy-gold"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-leroy-black text-white px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                    Ingresar
                </button>
                {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
                <button onClick={onCancel} className="w-full text-center mt-4 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black">
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
  }

  // PANTALLA 1: TABLA DE GESTIÓN (Si NO estamos editando ni añadiendo)
  if (!editingProperty && !isNewProperty) {
      return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-3xl text-leroy-black">Gestión de Propiedades ({properties.length})</h1>
              <div className="flex space-x-4">
                <button 
                    onClick={handleCreateNew} 
                    className="bg-leroy-gold text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors"
                >
                  + Crear Nueva Propiedad
                </button>
                <button onClick={onCancel} className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black">
                  Cerrar Sesión
                </button>
              </div>
            </div>
            
            {/* Tabla de Propiedades */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {properties.map((property) => (
                            <tr key={property.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location.split(',')[0]}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {property.currency} {property.price.toLocaleString('es-CL')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {property.isPublished ? 'Publicada' : 'Borrador'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleEdit(property)} 
                                        className="text-leroy-black hover:text-leroy-gold mr-3"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(property.id)} 
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {properties.length === 0 && (
                <p className="mt-8 text-center text-gray-500">Aún no hay propiedades en el sistema.</p>
            )}
          </div>
        </div>
      );
  }

  // PANTALLA 2: FORMULARIO (Si estamos editando o añadiendo)
  return (
      <div className="pt-24 pb-20 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="font-serif text-3xl text-leroy-black mb-6">
                  {id ? 'Editar Propiedad Existente' : 'Agregar Nueva Propiedad'}
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow rounded-lg">
                  
                  {/* --- CONTROL DE ESTADO --- */}
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <button 
                        type="button" 
                        onClick={resetForm} 
                        className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
                    >
                        &larr; Volver a la Lista
                    </button>
                    
                    <div className="flex items-center space-x-6">
                        {/* Control Premium */}
                        <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <span className="text-xs font-bold uppercase tracking-widest text-leroy-black">Clasificación Premium</span>
                            <div className="relative">
                                <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-leroy-gold"></div>
                            </div>
                        </label>

                        {/* Control Publicado */}
                        <label className="flex items-center space-x-4 cursor-pointer select-none">
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${isPublished ? 'text-green-600' : 'text-gray-500'}`}>
                                {isPublished ? 'PUBLICADA' : 'BORRADOR'}
                            </span>
                            <div className="relative">
                                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </div>
                        </label>
                    </div>
                  </div>
                  
                  {/* --- SECCIÓN DATOS PÚBLICOS --- */}
                  <div className="border-b border-gray-200 pb-5">
                      <h2 className="text-xl font-semibold leading-7 text-gray-900">1. Información de Publicación</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">Detalles visibles para los clientes en el sitio web.</p>
                  </div>
                  
                  {/* Título y Subtítulo */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Título</label>
                          <input
                              type="text" id="title" required
                              value={title} onChange={(e) => setTitle(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                      <div className="sm:col-span-3">
                          <label htmlFor="subtitle" className="block text-sm font-medium leading-6 text-gray-900">Subtítulo (Opcional)</label>
                          <input
                              type="text" id="subtitle"
                              value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>

                  {/* Ubicación y Tipo */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">Ubicación (Comuna)</label>
                          <select
                              id="location" required
                              value={location} onChange={(e) => setLocation(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          >
                              {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                      <div className="sm:col-span-3">
                          <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">Tipo de Propiedad</label>
                          <select
                              id="type" required
                              value={type} onChange={(e) => setType(e.target.value as PropertyType)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          >
                              {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                      </div>
                  </div>

                  {/* Precio y Moneda */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Precio</label>
                          <input
                              type="number" id="price" required min="0" step="1"
                              value={price} onChange={(e) => setPrice(parseInt(e.target.value))}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                      <div className="sm:col-span-3">
                          <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-900">Moneda</label>
                          <select
                              id="currency" required
                              value={currency} onChange={(e) => setCurrency(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          >
                              <option value="UF">UF</option>
                              <option value="$">Pesos (CLP)</option>
                              <option value="USD">USD</option>
                              <option value="€">€</option>
                          </select>
                      </div>
                  </div>

                  {/* Habitaciones, Baños y Área */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-2">
                          <label htmlFor="bedrooms" className="block text-sm font-medium leading-6 text-gray-900">Habitaciones</label>
                          <input
                              type="number" id="bedrooms" required min="1"
                              value={bedrooms} onChange={(e) => setBedrooms(parseInt(e.target.value))}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                      <div className="sm:col-span-2">
                          <label htmlFor="bathrooms" className="block text-sm font-medium leading-6 text-gray-900">Baños</label>
                          <input
                              type="number" id="bathrooms" required min="1"
                              value={bathrooms} onChange={(e) => setBathrooms(parseInt(e.target.value))}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                      <div className="sm:col-span-2">
                          <label htmlFor="area" className="block text-sm font-medium leading-6 text-gray-900">Área (m²)</label>
                          <input
                              type="number" id="area" required min="1"
                              value={area} onChange={(e) => setArea(parseInt(e.target.value))}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          />
                      </div>
                  </div>

                  {/* URL de Imagen */}
                  <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-gray-900">URL de Imagen Principal</label>
                      <input
                          type="url" id="imageUrl"
                          value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                      />
                  </div>

                  {/* Descripción */}
                  <div>
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Descripción Larga</label>
                      <textarea
                          id="description" rows={5} required
                          value={description} onChange={(e) => setDescription(e.target.value)}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                          placeholder="Describa la propiedad, el entorno y los detalles de lujo..."
                      />
                  </div>

                  {/* Amenidades */}
                  <div>
                      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Amenidades</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {COMMON_AMENITIES.map(amenity => (
                              <div key={amenity} className="flex items-center">
                                  <input
                                      id={`amenity-${amenity}`}
                                      type="checkbox"
                                      checked={selectedAmenities.includes(amenity)}
                                      onChange={() => toggleAmenity(amenity)}
                                      className="h-4 w-4 rounded border-gray-300 text-leroy-gold focus:ring-leroy-gold"
                                  />
                                  <label htmlFor={`amenity-${amenity}`} className="ml-3 text-sm text-gray-600">{amenity}</label>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* --- SECCIÓN DATOS PRIVADOS --- */}
                  <div className="border-b border-gray-200 pb-5 pt-8">
                      <h2 className="text-xl font-semibold leading-7 text-red-700">2. Datos Privados (Confidencial)</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">Solo para uso interno: información de contacto del dueño y legal.</p>
                  </div>
                  
                  {/* Dueño y Contacto */}
                  <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                          <label htmlFor="ownerName" className="block text-sm font-medium leading-6 text-gray-900">Nombre del Propietario</label>
                          <input
                              type="text" id="ownerName"
                              value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 bg-red-50"
                          />
                      </div>
                      <div className="sm:col-span-3">
                          <label htmlFor="ownerPhone" className="block text-sm font-medium leading-6 text-gray-900">Teléfono / Contacto</label>
                          <input
                              type="text" id="ownerPhone"
                              value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 bg-red-50"
                          />
                      </div>
                      <div className="sm:col-span-6">
                          <label htmlFor="legalDescription" className="block text-sm font-medium leading-6 text-gray-900">Datos Legales (Rol, Inscripción, etc.)</label>
                          <input
                              type="text" id="legalDescription"
                              value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 bg-red-50"
                          />
                      </div>
                      <div className="sm:col-span-6">
                          <label htmlFor="privateNotes" className="block text-sm font-medium leading-6 text-gray-900">Notas Internas</label>
                          <textarea
                              id="privateNotes" rows={3}
                              value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 bg-red-50"
                              placeholder="Acuerdos de comisión, disponibilidad de llaves, puntos de negociación, etc."
                          />
                      </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100 mt-8">
                      <button 
                          type="submit" 
                          className="bg-leroy-black text-white px-10 py-4 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
                      >
                          {id ? 'Guardar Cambios' : (isPublished ? 'Crear y PUBLICAR' : 'Crear como BORRADOR')}
                      </button>
                  </div>

              </form>
          </div>
      </div>
  );
};

export default AdminView;
