
import React, { useState, useMemo, useEffect } from 'react';
import { Property, AuthMode } from './types';
import { geminiService } from './services/geminiService';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import AdminModal from './components/AdminModal';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';

const INITIAL_PROPERTIES: Property[] = [
  { id: '1', title: 'Villa Mediterránea', price: 850000, location: 'Alicante', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', description: 'Increíble villa con vistas al mar.', sqft: 250, rooms: 4 },
  { id: '2', title: 'Piso Céntrico Madrid', price: 420000, location: 'Madrid', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', description: 'Piso reformado en el centro.', sqft: 85, rooms: 2 },
  { id: '3', title: 'Piso Céntrico Madrid (Copia)', price: 420000, location: 'Madrid', status: 'Review', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', description: 'Piso reformado en el centro.', sqft: 85, rooms: 2 },
  { id: '4', title: 'Mansión en la Luna', price: 99999999, location: 'Espacio', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80', description: 'Propiedad con baja gravedad.', sqft: 1000, rooms: 20 },
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
    const flags = await geminiService.auditProperties(properties);
    setProperties(prev => prev.map(p => {
      const flag = flags.find(f => f.id === p.id);
      return flag ? { ...p, aiFlag: flag.reason } : { ...p, aiFlag: undefined };
    }));
    setIsAuditing(false);
    setActiveTab('audit');
  };

  const handleDelete = (id: string) => {
    if (authMode !== 'Admin') {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm('¿Deseas eliminar esta propiedad de LEROYRESIDENCE permanentemente?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteAllFlagged = () => {
    if (authMode !== 'Admin') {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm(`Se eliminarán ${stats.flagged} registros sugeridos por la IA. ¿Continuar?`)) {
      setProperties(prev => prev.filter(p => !p.aiFlag));
      setActiveTab('all');
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'audit') return matchesSearch && !!p.aiFlag;
    if (activeTab === 'archived') return matchesSearch && p.status === 'Archived';
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        flaggedCount={stats.flagged}
      />

      <div className="flex-1 flex flex-col">
        <Navbar 
          authMode={authMode} 
          onAdminClick={() => setIsAdminModalOpen(true)}
          onLogout={() => setAuthMode('Standard')}
        />

        <main className="p-8 max-w-7xl mx-auto w-full">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
                {activeTab === 'all' ? 'Inventario Global' : activeTab === 'audit' ? 'Limpieza IA' : 'Archivo'}
              </h1>
              <p className="text-zinc-500 mt-2 text-lg font-medium">
                Panel maestro de gestión para <span className="text-emerald-600 font-bold">LEROYRESIDENCE</span>.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Filtrar propiedades..."
                  className="pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-72 shadow-sm transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                onClick={runAudit}
                disabled={isAuditing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 flex items-center gap-3"
              >
                {isAuditing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                {isAuditing ? 'Auditando...' : 'Auditoría IA'}
              </button>
            </div>
          </header>

          <DashboardStats stats={stats} />

          {activeTab === 'audit' && stats.flagged > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="bg-amber-100 p-4 rounded-2xl text-amber-600">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-amber-900 uppercase tracking-widest text-sm">Registros Irregulares Detectados</h4>
                  <p className="text-amber-800/70 text-sm font-medium">La IA sugiere eliminar {stats.flagged} propiedades por duplicidad o datos erróneos.</p>
                </div>
              </div>
              
              <button 
                onClick={handleDeleteAllFlagged}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-red-100 flex items-center gap-3 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Depurar Todo
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onDelete={() => handleDelete(property.id)}
                isAdmin={authMode === 'Admin'}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-100">
              <div className="text-zinc-200 mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Inventario Impecable</h3>
              <p className="text-zinc-400 mt-2 font-medium max-w-xs mx-auto text-sm leading-relaxed">No hay propiedades pendientes de revisión o que coincidan con tus filtros.</p>
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
