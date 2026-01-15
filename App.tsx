import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-client';
import AdminModal from './components/AdminModal';

// --- CONFIGURACIÓN DE CONEXIÓN ---
const SUPABASE_URL = "https://xocgjxaofsuoeqetsfld.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qOd-xIW-C5HkcUHNApP3bw_PFTanZdh";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); // Modo Admin Activado/Desactivado
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Ver Biblioteca o Web
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProperties(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar de la base de datos de Leroy Residence?')) {
      await supabase.from('properties').delete().eq('id', id);
      fetchProperties();
    }
  };

  const filtered = useMemo(() => {
    return properties.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  // --- VISTA 1: BIBLIOTECA DE PROPIEDADES (ADMIN) ---
  if (isAdmin && showAdminPanel) {
    return (
      <div className="min-h-screen bg-zinc-50 flex">
        {/* Barra Lateral Izquierda */}
        <aside className="w-80 bg-white border-r border-zinc-200 p-10 flex flex-col sticky top-0 h-screen">
          <div className="mb-12">
            <span className="text-2xl font-black italic tracking-tighter uppercase">LeR <span className="text-emerald-600">Admin</span></span>
          </div>
          <nav className="space-y-4 flex-1">
            <button className="w-full text-left font-black text-[10px] uppercase tracking-widest bg-zinc-900 text-white p-4 rounded-2xl">Inventario Central</button>
            <button className="w-full text-left font-black text-[10px] uppercase tracking-widest text-zinc-400 p-4 hover:bg-zinc-100 rounded-2xl transition-all">Auditoría IA</button>
          </nav>
          <button 
            onClick={() => setShowAdminPanel(false)} 
            className="text-zinc-900 font-black text-[10px] uppercase tracking-widest border-2 border-zinc-900 p-4 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all"
          >
            ← Volver a la Web
          </button>
        </aside>

        {/* Contenido Principal de la Biblioteca */}
        <main className="flex-1 p-12 overflow-y-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">Biblioteca</h1>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Gestión masiva de activos</p>
            </div>
            <div className="flex gap-4">
              <input 
                placeholder="BUSCAR..." 
                className="bg-white border px-6 py-3 rounded-2xl text-xs font-bold uppercase outline-none focus:ring-2 ring-emerald-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-zinc-100 shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Propiedad</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Ubicación</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest">Precio</th>
                  <th className="p-8 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="p-8 flex items-center gap-4">
                      <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                      <span className="font-black uppercase text-sm">{p.title}</span>
                    </td>
                    <td className="p-8 text-zinc-400 font-bold text-xs uppercase">{p.location}</td>
                    <td className="p-8 font-black text-sm italic">UF {Number(p.price).toLocaleString()}</td>
                    <td className="p-8 text-right">
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // --- VISTA 2: WEB PÚBLICA (LEROY RESIDENCE) ---
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="p-10 flex justify-between items-center border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <span className="text-3xl font-black italic tracking-tighter uppercase leading-none">LEROY <span className="text-zinc-600">RESIDENCE</span></span>
        <div className="flex gap-6 items-center">
          {isAdmin ? (
            <button 
              onClick={() => setShowAdminPanel(true)} 
              className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
            >
              Entrar a Biblioteca
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="border border-zinc-700 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Ingresar Admin
            </button>
          )}
        </div>
      </nav>

      <main className="p-10 max-w-[1400px] mx-auto">
        <header className="py-20 text-center">
          <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">Exclusividad en<br/>cada detalle</h2>
          <p className="text-zinc-500 tracking-[0.5em] uppercase text-xs">Concepción • Santiago • Marbella</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtered.map(p => (
            <div key={p.id} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden mb-6 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-black text-xl uppercase tracking-tighter leading-none mb-1">{p.title}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{p.location}</p>
                </div>
                <p className="font-black text-xl italic tracking-tighter">UF {Number(p.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AdminModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => { setIsAdmin(true); setShowLoginModal(false); }} 
      />
    </div>
  );
};

export default App;
