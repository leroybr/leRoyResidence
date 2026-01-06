
import React from 'react';

interface SidebarProps {
  activeTab: 'all' | 'audit' | 'archived';
  onTabChange: (tab: 'all' | 'audit' | 'archived') => void;
  flaggedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, flaggedCount }) => {
  const items = [
    { id: 'all', label: 'Propiedades', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'audit', label: 'Limpieza IA', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', badge: flaggedCount },
    { id: 'archived', label: 'Papelera', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }
  ];

  return (
    <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col hidden lg:flex sticky top-0 h-screen">
      <div className="p-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-14">
          <div className="bg-zinc-900 text-white p-3 rounded-2xl rotate-6">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase italic">LEROY<br/><span className="text-emerald-600">RESIDENCE</span></span>
        </div>

        <nav className="space-y-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                activeTab === item.id ? 'bg-zinc-900 text-white shadow-xl translate-x-1' : 'text-zinc-400 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[10px]">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
