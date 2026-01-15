import React, { useState, useMemo, useEffect } from 'react';
import { Property, AuthMode } from './types';
import { geminiService } from './services/geminiService';
import AdminModal from './components/AdminModal';

// --- Componentes Internos para Estabilidad ---

const Navbar: React.FC<{ authMode: AuthMode; onAdminClick: () => void; onLogout: () => void }> = ({ authMode, onAdminClick, onLogout }) => (
  <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-200 h-24 sticky top-0 z-50 px-10 flex items-center justify-between">
    <div>
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Estado del Sistema</span>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${authMode === 'Admin' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
        <span className="text-xs font-black uppercase tracking-widest">{authMode === 'Admin' ? 'Acceso Maestro' : 'Modo Lectura'}</span>
      </div>
    </div>
    <div className="flex items-center gap-6">
      {authMode === 'Standard' ? (
        <button onClick={onAdminClick} className="bg-zinc-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">
          Desbloquear Admin
        </button>
      ) : (
        <button onClick={onLogout} className="text-red-600 text-[10px] font-black uppercase tracking-widest hover:underline px-4">
          Cerrar Sesión
        </button>
      )}
    </div>
  </nav>
);

const Sidebar: React.FC<{ activeTab: string; onTabChange: (t: any) => void; flaggedCount: number }> = ({ activeTab, onTabChange, flaggedCount }) => {
  const items = [
    { id: 'all', label: 'Inventario', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'audit', label: 'Limpieza IA', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', badge: flaggedCount },
    { id: 'archived', label: 'Historial', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }
  ];
  return (
    <aside className="w-80 bg-white border-r border-zinc-200 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
      <div className="p-10">
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-zinc-900 text-white p-3 rounded-2xl rotate-6 shadow-lg">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase italic">LEROY<br/><span className="text-emerald-600">RESIDENCE</span></span>
        </div>
        <nav className="space-y-2">
          {items.map(item => (
            <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === item.id ? 'bg-zinc-900 text-white shadow-xl translate-x-1' : 'text-zinc-400 hover:bg-zinc-50'}`}>
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
              </div>
              {item.badge > 0 && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[10px]">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const PropertyCard: React.FC<{ property: Property; onDelete: () => void; isAdmin: boolean }> = ({ property, onDelete, isAdmin }) => (
  <div className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border transition-all duration-500 relative group ${property.aiFlag ? 'border-amber-200 ring-8 ring-amber-50' : 'border-zinc-200 hover:shadow-2xl hover:-translate-y-1'}`}>
    <div className="h-64 overflow-hidden relative">
      <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute top-6 left-6 flex gap-2">
        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${property.status === 'Available' ? 'bg-white/90 text-emerald-600' : 'bg-zinc-900 text-white'}`}>{property.status}</span>
        {property.aiFlag && <span className="bg-amber-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200 animate-pulse">Sugerido Borrar</span>}
      </div>
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black text-zinc-900 leading-none mb-2">{property.title}</h3>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{property.location}</p>
        </div>
        <p className="text-xl font-black text-zinc-900">${property.price.toLocaleString()}</p>
      </div>
      {property.aiFlag && (
        <div className="mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <p className="text-[9px] font-black text-amber-800 uppercase tracking-[0.2em] mb-1">Motivo IA:</p>
          <p className="text-xs text-amber-700 italic font-medium">"{property.aiFlag}"</p>
        </div>
      )}
      <div className="flex gap-3 pt-6 border-t border-zinc-50">
        <button className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Detalles</button>
        <button onClick={onDelete} className={`px-5 py-4 rounded-2xl transition-all border ${isAdmin ? 'bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border-red-100 shadow-md shadow-red-50' : 'bg-zinc-50 text-zinc-200 border-zinc-100 cursor-not-allowed'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  </div>
);

// --- Aplicación Principal ---

const INITIAL_PROPERTIES: Property[] = [
  { id: '1', title: 'Villa Mediterránea', price: 850000, location: 'Alicante', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', description: 'Increíble villa con vistas al mar.', sqft: 250, rooms: 4 },
  { id: '2', title: 'Piso Céntrico Madrid', price: 420000, location: 'Madrid', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', description: 'Piso reformado en el centro.', sqft: 85, rooms: 2 },
  { id: '3', title: 'Piso Céntrico Madrid (Copia)', price: 420000, location: 'Madrid', status: 'Review', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', description: 'Piso reformado en el centro.', sqft: 85, rooms: 2 },
  { id: '4', title: 'Residencia Lujo Costa', price: 1200000, location: 'Marbella', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', description: 'Propiedad exclusiva con piscina infinita.', sqft: 450, rooms: 6 },
  { id: '5', title: 'Apartamento Playa', price: 150000, location: 'Valencia', status: 'Sold', imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', description: 'A 50 metros de la arena.', sqft: 60, rooms: 1 }
];

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('leroy_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  const [authMode, setAuthMode] = useState<AuthMode>('Standard');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'audit' | 'archived'>('all');

  useEffect(() => {
    localStorage.setItem('leroy_properties', JSON.stringify(properties));
  }, [properties]);

  const stats = useMemo(() => ({
    total: properties.length,
    value: properties.reduce((acc, p) => acc + p.price, 0),
    flagged: properties.filter(p => p.aiFlag).length
  }), [properties]);

  const runAudit = async () => {
    setIsAuditing(true);
    try {
      const flags = await geminiService.auditProperties(properties);
      setProperties(prev => prev.map(p => {
        const flag = flags.find(f => f.id === p.id);
        return flag ? { ...p, aiFlag: flag.reason } : { ...p, aiFlag: undefined };
      }));
      setActiveTab('audit');
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsAuditing(false); 
    }
  };

  const handleDelete = (id: string) => {
    if (authMode !== 'Admin') {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm('¿Deseas eliminar permanentemente este registro de LeroyResidence?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteAllFlagged = () => {
    if (authMode !== 'Admin') {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm(`Se eliminarán las ${stats.flagged} propiedades marcadas como irregulares. ¿Confirmas la limpieza total?`)) {
      setProperties(prev => prev.filter(p => !p.aiFlag));
      setActiveTab('all');
    }
  };

  const filtered = properties.filter(p => {
    const search = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'audit') return search && !!p.aiFlag;
    if (activeTab === 'archived') return search && (p.status === 'Sold' || p.status === 'Archived');
    return search;
  });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} flaggedCount={stats.flagged} />
      <div className="flex-1 flex flex-col">
        <Navbar authMode={authMode} onAdminClick={() => setIsAdminModalOpen(true)} onLogout={() => setAuthMode('Standard')} />
        
        <main className="p-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic leading-tight">
                {activeTab === 'all' ? 'Inventario Central' : activeTab === 'audit' ? 'Auditoría IA' : 'Historial de Activos'}
              </h1>
              <p className="text-zinc-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-3 bg-zinc-100 inline-block px-3 py-1 rounded-full">Sistema Maestro LeroyResidence</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Buscar por nombre o zona..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="px-6 py-4 bg-white border border-zinc-200 rounded-3xl outline-none focus:ring-8 focus:ring-emerald-500/10 focus:border-emerald-500 flex-1 md:w-80 font-bold text-xs uppercase tracking-widest shadow-sm transition-all" 
              />
              <button 
                onClick={runAudit} 
                disabled={isAuditing} 
                className="bg-zinc-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-4 shadow-2xl hover:bg-black transition-all disabled:opacity-50 active:scale-95"
              >
                {isAuditing ? (
                   <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
                {isAuditing ? 'Analizando...' : 'Escanear IA'}
              </button>
            </div>
          </div>

          {activeTab === 'audit' && stats.flagged > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="bg-amber-100 p-5 rounded-3xl text-amber-600 shadow-inner">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-amber-900 uppercase tracking-widest text-sm mb-1">Detección de Anomalías</h4>
                  <p className="text-amber-800/60 text-sm font-medium italic">Se han encontrado {stats.flagged} registros que podrían estar duplicados o contener errores.</p>
                </div>
              </div>
              <button 
                onClick={handleDeleteAllFlagged}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-red-100 flex items-center gap-3 active:scale-95"
              >
                Limpiar Todo el Listado
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 group-hover:text-emerald-500 transition-colors">Total Inventario</p>
              <p className="text-5xl font-black text-zinc-900 tracking-tighter">{stats.total}</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 group-hover:text-emerald-500 transition-colors">Valor Cartera</p>
              <p className="text-5xl font-black text-emerald-600 tracking-tighter">${(stats.value / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-3 group-hover:text-amber-500 transition-colors">Sugerencias Borrado</p>
              <p className="text-5xl font-black text-amber-500 tracking-tighter">{stats.flagged}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filtered.map(p => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                isAdmin={authMode === 'Admin'} 
                onDelete={() => handleDelete(p.id)} 
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-zinc-100">
              <div className="bg-zinc-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-200">
                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Sin coincidencias</h3>
              <p className="text-zinc-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Ajusta los filtros de LeroyResidence</p>
            </div>
          )}
        </main>
      </div>
      
      <AdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onSuccess={() => { 
          setAuthMode('Admin'); 
          setIsAdminModalOpen(false); 
        }} 
      />
    </div>
  );
};

export default App;
