import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-client';
import { Property, AuthMode } from './types';
import AdminModal from './components/AdminModal';

// CONEXIÓN OFICIAL LEROY RESIDENCE
const SUPABASE_URL = "https://xocgjxaofsuoeqetsfld.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qOd-xIW-C5HkcUHNApP3bw_PFTanZdh";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>('Standard');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Carga los datos desde Supabase
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProperties(data);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Si eres Admin ves TODO. Si eres público, solo lo "Published"
      if (authMode === 'Admin') return matchesSearch;
      return matchesSearch && p.status === 'Published';
    });
  }, [properties, searchTerm, authMode]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    const { error } = await supabase.from('properties').update({ status: newStatus }).eq('id', id);
    if (!error) fetchProperties();
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Deseas eliminar permanentemente este registro de LeroyResidence?')) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) fetchProperties();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      {/* NAVBAR ORIGINAL */}
      <nav className="h-24 px-10 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <span className="text-2xl font-black tracking-tighter italic uppercase">LEROY RESIDENCE</span>
        <div className="flex gap-6 items-center">
          <input 
            type="text" 
            placeholder="BUSCAR PROPIEDAD..." 
            className="bg-zinc-100 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-zinc-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => authMode === 'Admin' ? setAuthMode('Standard') : setIsAdminModalOpen(true)}
            className="bg-zinc-900 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all"
          >
            {authMode === 'Admin' ? 'SALIR' : 'INGRESAR'}
          </button>
        </div>
      </nav>

      <main className="p-10 max-w-[1600px] mx-auto">
        {loading ? (
          <div className="py-40 text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">Cargando Galería Privada...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filtered.map(p => (
              <div key={p.id} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-zinc-100 mb-8 relative shadow-sm">
                  <img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={p.title} />
                  
                  {/* Etiqueta de Estado solo para el Admin */}
                  {authMode === 'Admin' && (
                    <div className="absolute top-6 left-6 flex gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'Published' ? 'bg-white text-emerald-600' : 'bg-zinc-900 text-white'}`}>
                        {p.status === 'Published' ? 'Visible' : 'Oculto'}
                      </span>
                    </div>
                  )}

                  {/* Controles de Admin sobre la foto */}
                  {authMode === 'Admin' && (
                    <div className="absolute bottom-6 left-6 right-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => toggleStatus(p.id, p.status)} className="flex-1 bg-white/90 backdrop-blur-md py-3 text-[9px] font-black uppercase tracking-widest hover:bg-white">
                        {p.status === 'Published' ? 'Ocultar' : 'Publicar'}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-4 py-3 hover:bg-red-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <h3 className="font-black text-lg uppercase tracking-tighter leading-none">{p.title}</h3>
                    <p className="font-black text-lg tracking-tighter italic">UF {p.price.toLocaleString()}</p>
                  </div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">{p.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Acceso */}
      <AdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onSuccess={() => { setAuthMode('Admin'); setIsAdminModalOpen(false); }} 
      />
    </div>
  );
};

export default App;
