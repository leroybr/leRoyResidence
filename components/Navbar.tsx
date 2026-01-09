
import React from 'react';
import { AuthMode } from '../types';

interface NavbarProps {
  authMode: AuthMode;
  onAdminClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ authMode, onAdminClick, onLogout }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200 h-20 sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Branding Móvil */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="bg-zinc-900 text-white p-2 rounded-lg">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
           </svg>
        </div>
        <span className="font-black text-lg tracking-tight italic">LEROYRESIDENCE</span>
      </div>

      {/* Indicadores de Estado y Sincronización Real */}
      <div className="hidden lg:flex items-center gap-8">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Seguridad del Panel</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${authMode === 'Admin' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-sm font-bold text-zinc-800">{authMode === 'Admin' ? 'Acceso Administrativo' : 'Modo Consulta'}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-zinc-200" />
        
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Base de Datos</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-tight italic">Cambios Sincronizados</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {authMode === 'Standard' ? (
          <button 
            onClick={onAdminClick}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-zinc-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Acceso Maestro
          </button>
        ) : (
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Super Usuario</span>
                <button 
                  onClick={onLogout}
                  className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:text-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
             </div>
             <div className="relative">
                <img className="w-10 h-10 rounded-full border-2 border-emerald-500 p-0.5" src="https://i.pravatar.cc/100?u=leroy" alt="Admin Avatar" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white"></div>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
