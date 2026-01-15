import React, { useState, useEffect, useRef } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // CLAVE MAESTRA (La mantengo aquí para que sea fácil de editar para ti)
  const MASTER_KEY = 'LEROY2026';

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalizamos la entrada: quitamos espacios y pasamos a mayúsculas
    // Esto evita que el admin falle por un error de teclado
    const normalizedInput = password.trim().toUpperCase();
    
    if (normalizedInput === MASTER_KEY) { 
      setError(false);
      onSuccess(); // Esto llama a setAuthMode('Admin') en tu App.tsx
      setPassword('');
    } else {
      setError(true);
      // Feedback visual de error por 2 segundos
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200 animate-in zoom-in duration-500">
        <div className="p-12">
          <div className="mb-10 text-center">
            {/* El icono cambia de color si hay error */}
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-6 shadow-xl transition-all duration-300 ${error ? 'bg-red-500 shadow-red-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Control Maestro</h2>
            <p className="text-zinc-400 mt-2 text-sm font-bold uppercase tracking-widest">LeroyResidence Auth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-4 text-center">Introduce tu clave</label>
              <input 
                ref={inputRef}
                type="password"
                autoComplete="current-password"
                className={`w-full px-8 py-6 rounded-3xl border-2 outline-none transition-all font-black text-center text-3xl tracking-[0.3em] uppercase ${
                  error ? 'border-red-500 ring-8 ring-red-50 bg-red-50 text-red-600' : 'border-zinc-100 focus:ring-8 focus:ring-emerald-500/10 focus:border-emerald-500 bg-zinc-50/50'
                }`}
                placeholder="••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
              />
              {error && (
                <div className="absolute -bottom-10 left-0 right-0 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 animate-bounce inline-block">Clave Incorrecta</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-zinc-900 hover:bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl shadow-zinc-400 active:scale-95 mt-4"
            >
              Desbloquear Funciones
            </button>
            
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-zinc-400 hover:text-zinc-600 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Cancelar Acceso
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
