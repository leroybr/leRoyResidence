
import React, { useState } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La contraseña maestra es LEROY2025
    if (password === 'LEROY2025') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-zinc-200">
        <div className="p-8">
          <div className="mb-6 text-center">
            <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Acceso Restringido</h2>
            <p className="text-zinc-500 mt-2 text-sm">Necesitas permisos de administrador para eliminar registros del inventario.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Clave de Seguridad</label>
              <input 
                autoFocus
                type="password"
                className={`w-full px-4 py-4 rounded-xl border outline-none transition-all font-mono text-center text-lg ${
                  error ? 'border-red-500 ring-4 ring-red-50' : 'border-zinc-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500'
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <div className="flex items-center gap-2 mt-3 text-red-600 justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-wider">Contraseña incorrecta</p>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-zinc-200 active:scale-[0.98]"
            >
              Confirmar Identidad
            </button>
            
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-zinc-400 hover:text-zinc-600 py-2 text-xs font-bold uppercase tracking-widest transition-colors mt-2"
            >
              Volver al Panel
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <div className="bg-zinc-50 rounded-lg py-3 px-4 inline-block">
               <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Tu clave maestra es:</p>
               <p className="text-sm font-black text-emerald-600 tracking-[0.3em]">LEROY2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
