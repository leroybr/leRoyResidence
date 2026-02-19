
import React, { useState } from 'react';
import { Property, PropertyType, ListingType } from '../types';
import { COMMUNES } from '../constants';

interface AdminViewProps {
  onAddProperty: (property: Property) => void;
  onCancel: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onAddProperty, onCancel }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [location, setLocation] = useState(COMMUNES[0]);
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState('UF');
  const [type, setType] = useState<PropertyType>(PropertyType.VILLA);
  const [listingType, setListingType] = useState<ListingType>(ListingType.SALE);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [area, setArea] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
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
      listingType,
      bedrooms,
      bathrooms,
      area,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop', 
      description,
      amenities,
      isPremium
    };
    onAddProperty(newProperty);
  };

  return (
    <div className="pt-40 pb-20 min-h-screen bg-[#f8f9fa]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-serif text-5xl text-leroy-black mb-2">Panel de Listado</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Crea una nueva ficha de propiedad exclusiva</p>
          </div>
          <div className="flex gap-4">
            <button onClick={onCancel} className="px-6 py-3 border border-leroy-orange text-leroy-orange text-[10px] font-bold uppercase tracking-widest hover:bg-leroy-orange hover:text-white transition-all">
              Cerrar Sesión Segura
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl mb-8 border-b pb-4">Información General</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Título de la Propiedad</label>
                  <input required placeholder="Ej: Mansión Vista al Lago" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-b border-gray-200 py-3 text-lg focus:border-leroy-orange outline-none transition-all placeholder:text-gray-200" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Eslogan / Subtítulo</label>
                  <input placeholder="Ej: Una joya arquitectónica en el corazón de San Pedro" type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none transition-all italic text-gray-500" />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Tipo de Propiedad</label>
                    <select value={type} onChange={e => setType(e.target.value as PropertyType)} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none bg-transparent">
                      {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Ubicación</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none bg-transparent">
                      {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Descripción Detallada</label>
                  <textarea required rows={6} value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-100 bg-gray-50 p-4 text-sm focus:border-leroy-orange outline-none transition-all mt-2" placeholder="Describe los acabados, el entorno y la experiencia de vivir aquí..."></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl mb-8 border-b pb-4">Multimedia y Extras</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">URL de Imagen Principal</label>
                  <input placeholder="https://images.unsplash.com/..." type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border-b border-gray-200 py-3 text-xs focus:border-leroy-orange outline-none transition-all font-mono" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Comodidades (Amenities)</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={amenityInput} 
                      onChange={e => setAmenityInput(e.target.value)} 
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                      placeholder="Ej: Piscina Temperada" 
                      className="flex-grow border-b border-gray-200 py-2 text-sm focus:border-leroy-orange outline-none" 
                    />
                    <button type="button" onClick={handleAddAmenity} className="px-4 py-2 bg-leroy-black text-white text-[10px] font-bold uppercase">Añadir</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a, i) => (
                      <span key={i} className="bg-leroy-gray px-3 py-1 text-[10px] font-bold uppercase text-gray-600 flex items-center gap-2">
                        {a}
                        <button type="button" onClick={() => removeAmenity(i)} className="text-leroy-orange hover:text-leroy-black">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing and Stats Sidebar */}
          <div className="space-y-8">
            <div className="bg-leroy-black text-white p-10 shadow-2xl">
              <h2 className="font-serif text-2xl mb-8 border-b border-white/10 pb-4">Precio y Estado</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-white/40 mb-2 tracking-widest">Operación</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setListingType(ListingType.SALE)} className={`py-3 text-[10px] font-bold uppercase border ${listingType === ListingType.SALE ? 'bg-leroy-orange border-leroy-orange' : 'border-white/10 hover:border-white/30'}`}>Venta</button>
                    <button type="button" onClick={() => setListingType(ListingType.RENT)} className={`py-3 text-[10px] font-bold uppercase border ${listingType === ListingType.RENT ? 'bg-leroy-orange border-leroy-orange' : 'border-white/10 hover:border-white/30'}`}>Arriendo</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-2 tracking-widest">Moneda</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-transparent border-b border-white/20 py-3 text-sm focus:border-leroy-orange outline-none">
                      <option className="text-black" value="UF">UF</option>
                      <option className="text-black" value="USD">USD</option>
                      <option className="text-black" value="CLP">CLP</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-white/40 mb-2 tracking-widest">Valor</label>
                    <input required type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-transparent border-b border-white/20 py-3 text-xl font-bold focus:border-leroy-orange outline-none" />
                  </div>
                </div>

                <div className="pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${isPremium ? 'bg-leroy-orange border-leroy-orange' : 'border-white/20 group-hover:border-white/40'}`}>
                      {isPremium && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Propiedad Premium</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-2xl mb-8 border-b pb-4">Especificaciones</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Dormitorios</label>
                  <input type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Baños</label>
                  <input type="number" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">Superficie (m²)</label>
                  <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full border-b border-gray-200 py-3 text-sm focus:border-leroy-orange outline-none" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-leroy-orange text-white py-6 text-xs font-bold uppercase tracking-widest hover:bg-leroy-black transition-all shadow-xl flex items-center justify-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Publicar Listado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminView;
