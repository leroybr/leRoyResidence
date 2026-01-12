import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  // FALSE = Web de Lujo | TRUE = Biblioteca de Propiedades
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    // ESTA ES LA BIBLIOTECA PARA CAMBIAR PROPIEDADES RÁPIDO
    return (
      <div className="p-10 bg-gray-100 min-h-screen">
        <button onClick={() => setShowAdmin(false)} className="mb-5 text-blue-600 font-bold">← VOLVER A LA WEB PÚBLICA</button>
        <h1 className="text-3xl font-black mb-10 text-zinc-900">BIBLIOTECA DE PROPIEDADES (ADMIN)</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-zinc-500">Aquí podrás editar, subir y borrar tus propiedades de Concepción de forma masiva.</p>
          {/* Aquí irá tu lista de edición rápida */}
        </div>
      </div>
    );
  }

  // ESTA ES TU PÁGINA ACTUAL DE LEROY RESIDENCE (LO QUE VE EL CLIENTE)
  return (
    <div className="bg-black min-h-screen text-white">
      <nav className="p-6 flex justify-between items-center border-b border-zinc-800">
        <span className="text-2xl font-serif tracking-tighter">LEROY <span className="text-yellow-600">RESIDENCE</span></span>
        {/* Este botón es tu "llave" para entrar a la biblioteca */}
        <button onClick={() => setShowAdmin(true)} className="text-[10px] border border-zinc-700 px-4 py-2 hover:bg-white hover:text-black transition-all">INGRESAR ADMIN</button>
      </nav>

      <main className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-6xl font-serif mb-4">Exclusividad en cada detalle</h2>
        <p className="text-zinc-400 tracking-[0.4em] uppercase text-sm">Concepción • Santiago • Marbella</p>
        <div className="mt-10 flex bg-white rounded-full overflow-hidden w-full max-w-2xl text-black">
          <input className="flex-1 p-4 outline-none" placeholder="¿Qué ciudad buscas?" />
          <button className="bg-zinc-900 text-white px-10">BUSCAR</button>
        </div>
      </main>
    </div>
  );
};

export default App;
