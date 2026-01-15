import React, { useState, useMemo, useEffect } from 'react';
import { Property, AuthMode } from './types';
import AdminModal from './components/AdminModal';

const INITIAL_PROPERTIES: Property[] = [
  { id: '1', title: 'Villa Mediterránea', price: 850000, location: 'San Pedro de la Paz', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', description: 'Increíble villa con vistas al mar.', sqft: 250, rooms: 4 },
  { id: '2', title: 'Piso Céntrico Lujo', price: 420000, location: 'Concepción', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', description: 'Piso reformado en el centro.', sqft: 85, rooms: 2 },
];

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('leroy_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  
  const [authMode, setAuthMode] = useState<AuthMode>('Standard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sincronizar con LocalStorage
  useEffect(() => {
    localStorage.setItem('leroy_properties', JSON.stringify(properties));
  }, [properties]);

  // FUNCIONES DE GESTIÓN
  const addProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProp: Property = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      price: Number(formData.get('price')),
      location: formData.get('location') as string,
      status: 'Available',
      imageUrl: formData.get('image') as string || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800',
      description: '', sqft: 0, rooms: 0
    };
    setProperties([...properties, newProp]);
    setShowAddForm(false);
  };

  const toggleStatus = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, status: p.status === 'Available' ? 'Archived' : 'Available' } : p
    ));
  };

  const deleteProperty = (id: string) => {
    if (confirm('¿Eliminar definitivamente?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    // El público no ve las "Archived" (desactivadas)
    if (authMode === 'Standard') return matchesSearch && p.status === 'Available';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* NAVBAR ORIGINAL */}
      <nav className="fixed w-full z-50 flex justify-between items-center p-8 md:px-16 text-white mix-blend-difference">
        <div className="text-3xl font-serif">LeRoy Residence</div>
        <div className="flex gap-4">
          {authMode === 'Admin' && (
            <button onClick={() => setShowAddForm(true)} className="bg-emerald-600 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">+ Nueva Propiedad</button>
          )}
          <button 
            onClick={() => authMode === 'Admin' ? setAuthMode('Standard') : setShowLoginModal(true)}
            className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
          >
            {authMode === 'Admin' ? 'Salir Modo Maestro' : 'Ingresar'}
          </button>
        </div>
      </nav>

      {/* HERO SECTION (Mismo aspecto que tu imagen) */}
      <header className="relative h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden bg-zinc-900">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-white text-5xl md:text-7xl font-serif mb-12 leading-tight">Vende o compra tu propiedad con acompañamiento profesional y seguro.</h1>
          <div className="bg-white rounded-full p-2 flex shadow-2xl max-w-3xl mx-auto">
            <input type="text" placeholder="UBICACIÓN..." className="flex-1 px-8 py-4 outline-none rounded-full text-xs font-bold uppercase" onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="bg-zinc-900 text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">Buscar</button>
          </div>
        </div>
      </header>

      {/* CATALOGO DE PROPIEDADES */}
      <main className="max-w-[1400px] mx-auto py-24 px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {filtered.map(p => (
            <div key={p.id} className={`group relative ${p.status === 'Archived' ? 'opacity-50' : ''}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-xl mb-6 relative">
                <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                
                {/* CONTROLES MAESTROS (Solo visibles en Admin) */}
                {authMode === 'Admin' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => toggleStatus(p.id)} className="bg-white p-4 rounded-full text-zinc-900 font-bold text-[10px] uppercase">
                      {p.status === 'Available' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteProperty(p.id)} className="bg-red-600 p-4 rounded-full text-white font-bold text-[10px] uppercase">Eliminar</button>
                  </div>
                )}
                {p.status === 'Archived' && <div className="absolute top-6 left-6 bg-zinc-900 text-white px-4 py-2 rounded-full text-[8px] font-black uppercase">Oculto al público</div>}
              </div>
              <h3 className="text-2xl font-serif italic">{p.title}</h3>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">{p.location} • UF {p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>

      {/* FORMULARIO PARA INGRESAR PROPIEDADES (MODAL) */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <form onSubmit={addProperty} className="bg-white w-full max-w-lg rounded-[3rem] p-12 space-y-6">
            <h2 className="text-3xl font-serif italic text-center mb-8">Nueva Propiedad</h2>
            <input name="title" placeholder="TÍTULO (EJ: VILLA MODERNA)" required className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-emerald-500 font-bold uppercase text-xs" />
            <input name="location" placeholder="UBICACIÓN (EJ: CHIGUAYANTE)" required className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-emerald-500 font-bold uppercase text-xs" />
            <input name="price" type="number" placeholder="PRECIO EN UF" required className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-emerald-500 font-bold uppercase text-xs" />
            <input name="image" placeholder="URL DE LA IMAGEN (OPCIONAL)" className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-emerald-500 font-bold uppercase text-xs" />
            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 bg-zinc-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest">Guardar en Web</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <AdminModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => { setAuthMode('Admin'); setShowLoginModal(false); }} 
      />
    </div>
  );
};

export default App;
