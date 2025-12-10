import React, { useState } from 'react';
import { Property, PropertyType } from '../types';
import { COMMUNES } from '../constants';

// 🚨 1. Contraseña de Administrador (CÁMBIALA INMEDIATAMENTE)
const ADMIN_PASSWORD = 'C4s4sL3r0y!2026';

interface AdminViewProps {
  onAddProperty: (property: Property) => void;
  onCancel: () => void;
}

const COMMON_AMENITIES = [
  'Seguridad 24/7', 'Piscina Privada', 'Piscina Temperada', 'Quincho / BBQ',
  'Jardines', 'Estacionamiento', 'Vista Panorámica', 'Calefacción Central',
  'Bodega', 'Gimnasio', 'Spa', 'Domótica', 'Cava de Vinos', 'Cine en Casa'
];

const AdminView: React.FC<AdminViewProps> = ({ onAddProperty, onCancel }) => {
  
  // 2. Estados de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  // Lógica para el Login
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setPasswordInput(''); // Limpiar la contraseña
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
      setPasswordInput('');
    }
  };
  
  // El resto de tus estados de datos (title, location, price, etc.)
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
  
  // Estado para controlar la publicación. (Por defecto, no publicada)
  const [isPublished, setIsPublished] = useState(false); 

  // Private Data State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [legalDescription, setLegalDescription] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      // Asegurar que solo se envía si está autenticado (aunque el botón estaría oculto)
      if (!isAuthenticated) return; 

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
      amenities
