
import React from 'react';
import { AuthMode } from '../types';

interface NavbarProps {
  authMode: AuthMode;
  onAdminClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ authMode, onAdminClick, onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-200 h-24 sticky top-0 z-50 px-10 flex items-center justify-between">
      <div>
        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Estado</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${authMode === 'Admin' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-xs font-black uppercase tracking-widest">{authMode === 'Admin' ? 'Modo Admin' : 'Modo Lectura'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {authMode === 'Standard' ? (
          <button 
            onClick={onAdminClick}
            className="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all"
          >
            Acceso Maestro
          </button>
        ) : (
          <button 
            onClick={onLogout}
            className="text-red-600 text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
