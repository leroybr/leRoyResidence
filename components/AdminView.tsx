import React, { useState, useEffect, useCallback } from 'react';
// Asumo que estos types y constantes existen en tus archivos
// import { Property, PropertyType, PrivateData } from '../types'; 
// import { COMMUNES } from '../constants';

// --- SIMULACIÓN DE TYPES Y CONSTANTES (Reemplazar con tus archivos) ---
enum PropertyType {
    VILLA = 'Villa',
    APARTMENT = 'Apartamento',
    HOUSE = 'Casa',
    LAND = 'Terreno',
    COMMERCIAL = 'Comercial'
}

interface PrivateData {
    ownerName: string;
    ownerPhone: string;
    legalDescription: string;
    privateNotes: string;
}

interface Property {
    id: string;
    title: string;
    subtitle: string;
    location: string;
    price: number;
    currency: 'UF' | '$' | 'USD' | '€';
    type: PropertyType;
    bedrooms: number;
    bathrooms: number;
    area: number;
    imageUrl: string;
    description: string;
    amenities: string[];
    isPremium: boolean;
    isPublished: boolean;
    privateData: PrivateData;
}

const COMMUNES = [
    'Santiago', 'Las Condes', 'Providencia', 'Vitacura', 'Lo Barnechea',
    'Concepción', 'Viña del Mar', 'Valparaíso', 'Puerto Varas'
];
// ---------------------------------------------------------------------


const ADMIN_PASSWORD = 'C4s4sL3r0y!2026';

// Interfaz de Propiedades de AdminView (CORREGIDA)
interface AdminViewProps {
    properties: Property[]; // Lista de todas las propiedades (para la tabla)
    // CORRECCIÓN: Las funciones de CRUD en App.tsx son ASÍNCRONAS, por lo tanto, devuelven Promise<void>
    onAddProperty: (property: Property) => Promise<void>; 
    onUpdateProperty: (property: Property) => Promise<void>; // Para guardar cambios
    onDeleteProperty: (id: string) => Promise<void>;         // Para eliminar
    onCancel: () => void; // Usado para 'Volver al Inicio' / 'Cerrar Sesión'
}

const COMMON_AMENITIES = [
    'Seguridad 24/7', 'Piscina Privada', 'Piscina Temperada', 'Quincho / BBQ',
    'Jardines', 'Estacionamiento', 'Vista Panorámica', 'Calefacción Central',
    'Bodega', 'Gimnasio', 'Spa', 'Domótica', 'Cava de Vinos', 'Cine en Casa'
];

// Hacer el componente AdminView ASÍNCRONO para poder usar 'await' con los props
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
    
    // 2. Estados de Edición / Gestión
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [isNewProperty, setIsNewProperty] = useState(false); 
    
    // 3. Estados del Formulario (todos inicializados con valores controlados)
    const [id, setId] = useState<string | null>(null); 
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    // Usamos el primer elemento por defecto
    const [location, setLocation] = useState(COMMUNES.length > 0 ? COMMUNES[0] : '');
    // Uso de string para Price, Area, Bedrooms, Bathrooms en el input (más limpio para formularios)
    const [priceInput, setPriceInput] = useState('0');
    const [currency, setCurrency] = useState<'UF' | '$' | 'USD' | '€'>('UF'); 
    const [type, setType] = useState<PropertyType>(PropertyType.VILLA);
    const [bedroomsInput, setBedroomsInput] = useState('1');
    const [bathroomsInput, setBathroomsInput] = useState('1');
    const [areaInput, setAreaInput] = useState('0');
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
    const resetForm = useCallback(() => {
        setEditingProperty(null);
        setIsNewProperty(false);
        setId(null);
        setTitle('');
        setSubtitle('');
        setLocation(COMMUNES.length > 0 ? COMMUNES[0] : '');
        setPriceInput('0');
        setCurrency('UF');
        setType(PropertyType.VILLA);
        setBedroomsInput('1');
        setBathroomsInput('1');
        setAreaInput('0');
        setImageUrl('');
        setDescription('');
        setSelectedAmenities([]);
        setIsPremium(false);
        setIsPublished(false);
        setOwnerName('');
        setOwnerPhone('');
        setLegalDescription('');
        setPrivateNotes('');
    }, []);
    
    // useEffect: Precarga datos al entrar en modo edición
    useEffect(() => {
        if (editingProperty) {
            setId(editingProperty.id);
            setTitle(editingProperty.title);
            setSubtitle(editingProperty.subtitle);
            // Aseguramos que la ubicación sea solo la comuna (sin ', Chile')
            const comm = editingProperty.location.split(',')[0].trim();
            setLocation(COMMUNES.includes(comm) ? comm : COMMUNES[0]); // Fallback seguro
            
            // Usar .toString() para precargar los inputs numéricos como strings
            setPriceInput(editingProperty.price.toString());
            setCurrency(editingProperty.currency);
            setType(editingProperty.type);
            setBedroomsInput(editingProperty.bedrooms.toString());
            setBathroomsInput(editingProperty.bathrooms.toString());
            setAreaInput(editingProperty.area.toString());
            
            setImageUrl(editingProperty.imageUrl);
            setDescription(editingProperty.description);
            setSelectedAmenities(editingProperty.amenities);
            setIsPremium(editingProperty.isPremium);
            setIsPublished(editingProperty.isPublished);
            
            // Datos Privados
            setOwnerName(editingProperty.privateData.ownerName);
            setOwnerPhone(editingProperty.privateData.ownerPhone);
            setLegalDescription(editingProperty.privateData.legalDescription);
            setPrivateNotes(editingProperty.privateData.privateNotes);
            
            setIsNewProperty(false);
        } else if (isNewProperty) {
            // Si es propiedad nueva, reseteamos asegurando que el id es null
            // Uso de resetForm para consistencia, aunque se haga un reset al entrar en modo 'nuevo'
            // Podríamos evitar llamar a resetForm si ya se hizo en handleCreateNew,
            // pero lo dejamos para robustez si el isNewProperty cambia por otra vía.
            // Para simplificar, la lógica de `handleCreateNew` y `handleEdit` ahora son responsables.
        }
    }, [editingProperty, isNewProperty, resetForm]);
    
    
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
        setSelectedAmenities(prev => 
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    // Lógica de Envío del Formulario (Añadir O Actualizar) - AHORA ASÍNCRONA
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return; 

        // 💡 Convertir inputs de string a number y asegurar valores por defecto/mínimos
        const parsedPrice = parseInt(priceInput) || 0;
        const parsedBedrooms = parseInt(bedroomsInput) || 1;
        const parsedBathrooms = parseInt(bathroomsInput) || 1;
        const parsedArea = parseInt(areaInput) || 0;

        // Asegurar que el currency sea uno de los tipos válidos
        const validCurrency = (['UF', '$', 'USD', '€'] as const).includes(currency) ? currency : 'UF';
        
        const propertyData: Property = {
            id: id || `custom-${Date.now()}`, // Usa el ID existente o genera uno nuevo
            title: title.trim(),
            subtitle: subtitle.trim() || title.trim(), // Si no hay sub, usa el título
            location: `${location.trim()}, Chile`, // Formato consistente
            price: parsedPrice,
            currency: validCurrency,
            type,
            bedrooms: parsedBedrooms,
            bathrooms: parsedBathrooms,
            area: parsedArea,
            imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop', 
            description: description.trim(),
            amenities: selectedAmenities,
            isPremium, 
            isPublished, 
            privateData: {
                ownerName: ownerName.trim(),
                ownerPhone: ownerPhone.trim(),
                legalDescription: legalDescription.trim(),
                privateNotes: privateNotes.trim()
            }
        };

        try {
            if (id) {
                // MODO EDICIÓN: Llama a la función de actualización
                await onUpdateProperty(propertyData); 
            } else {
                // MODO NUEVO: Llama a la función de adición
                await onAddProperty(propertyData);
            }
            
            resetForm(); // Limpia el formulario y sale del modo edición/creación
        } catch (submitError) {
            // Manejo de errores de la API, si las funciones pasadas (onAdd/onUpdate) los lanzan
            console.error('Error al guardar la propiedad:', submitError);
            alert('Error al guardar la propiedad. Consulte la consola para más detalles.');
        }
    };
    
    // Funciones de control de la tabla
    const handleEdit = (property: Property) => {
        // Establecer la propiedad para que el useEffect la precargue
        setEditingProperty(property); 
        setIsNewProperty(false); 
    };
    
    const handleCreateNew = () => {
        // Limpia el formulario ANTES de entrar en modo creación
        resetForm();
        setIsNewProperty(true); 
    };

    // Función de eliminación - AHORA ASÍNCRONA
    const handleDelete = async (propertyId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción es permanente.')) {
            try {
                // Llamar a la función asíncrona pasada por prop
                await onDeleteProperty(propertyId);
                // Si la eliminación fue exitosa, no hace falta recargar, App.tsx ya lo hace
            } catch (deleteError) {
                console.error('Error al eliminar la propiedad:', deleteError);
                alert('Error al eliminar la propiedad. Consulte la consola para más detalles.');
            }
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
                    <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th> {/* Añadido Tipo */}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.type}</td> {/* Mostrar Tipo */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {property.isPublished ? 'Publicada' : 'Borrador'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleEdit(property)} 
                                                className="text-leroy-black hover:text-leroy-gold mr-3 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(property.id)} 
                                                className="text-red-600 hover:text-red-900 transition-colors"
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
                            onClick={resetForm} // Vuelve a la lista de gestión
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
                                // Asegurar que el valor es de tipo PropertyType
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
                                // Uso de priceInput (string) para mejor control de input numérico
                                value={priceInput} onChange={(e) => setPriceInput(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-900">Moneda</label>
                            <select
                                id="currency" required
                                // Forzar el tipo de currency para mantener consistencia
                                value={currency} onChange={(e) => setCurrency(e.target.value as 'UF' | '$' | 'USD' | '€')}
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
                                value={bedroomsInput} onChange={(e) => setBedroomsInput(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="bathrooms" className="block text-sm font-medium leading-6 text-gray-900">Baños</label>
                            <input
                                type="number" id="bathrooms" required min="1"
                                value={bathroomsInput} onChange={(e) => setBathroomsInput(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-leroy-gold sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="area" className="block text-sm font-medium leading-6 text-gray-900">Área (m²)</label>
                            <input
                                type="number" id="area" required min="1"
                                value={areaInput} onChange={(e) => setAreaInput(e.target.value)}
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
                                type="text" id="ownerName" required
                                value={ownerName} onChange={(e) => setOwnerName(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="ownerPhone" className="block text-sm font-medium leading-6 text-gray-900">Teléfono del Propietario</label>
                            <input
                                type="tel" id="ownerPhone" required
                                value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        {/* Continuación de Datos Privados */}
                        <div className="sm:col-span-6">
                            <label htmlFor="legalDescription" className="block text-sm font-medium leading-6 text-gray-900">Descripción Legal (Notas de Escritura)</label>
                            <textarea
                                id="legalDescription" rows={3}
                                value={legalDescription} onChange={(e) => setLegalDescription(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                placeholder="Especifique número de rol, metros legales, cargas, etc."
                            />
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="privateNotes" className="block text-sm font-medium leading-6 text-gray-900">Notas Internas</label>
                            <textarea
                                id="privateNotes" rows={3}
                                value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                placeholder="Notas internas para el equipo: comisión, estado de visita, urgencia de venta..."
                            />
                        </div>
                    </div>
                    
                    {/* Botones de Acción Final */}
                    <div className="mt-8 flex justify-end gap-x-6 pt-5 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-leroy-gold px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leroy-gold transition-colors"
                        >
                            {id ? 'Guardar Cambios' : 'Crear Propiedad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminView;
