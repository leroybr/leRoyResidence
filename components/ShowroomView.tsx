// components/ShowroomView.tsx

import React, { useState } from 'react';

// CORRECCIÓN CLAVE: Definición de la interfaz de props
interface ShowroomViewProps {
    onNavigate: (view: string, category?: string) => void; 
}

// Datos de ejemplo para el showroom
const KITCHEN_TRENDS = [
    { id: 1, title: "Isla Central Inteligente", description: "El futuro de la cocina modular con carga inalámbrica integrada." },
    { id: 2, title: "Almacenamiento Invisible", description: "Sistemas motorizados de apertura y cierre para una estética limpia." },
    { id: 3, title: "Encimeras de Cuarzo Reciclado", description: "Lujo sostenible: Materiales de alto rendimiento y bajo impacto ambiental." },
];

const ShowroomView: React.FC<ShowroomViewProps> = ({ onNavigate }) => {
    const [selectedModal, setSelectedModal] = useState<number | null>(null);

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 font-sans">
            
            {/* Encabezado y Navegación */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => onNavigate('home')} 
                    className="mb-8 text-sm text-black hover:text-gray-600 font-bold flex items-center transition duration-150"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Volver a Inicio
                </button>
                
                <h1 className="text-5xl font-serif text-gray-900 mb-4">El Showroom de LeRoy</h1>
                <p className="text-xl text-gray-600 mb-12">Descubre las últimas tendencias en diseño interior y tecnología de hogar para tu próxima propiedad.</p>

                {/* Sección de Tendencias */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Tendencias en Cocinas Premium</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {KITCHEN_TRENDS.map(trend => (
                        <div key={trend.id} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
                            <h3 className="text-xl font-bold mb-3 text-orange-600">{trend.title}</h3>
                            <p className="text-gray-700">{trend.description}</p>
                            <button 
                                onClick={() => setSelectedModal(trend.id)}
                                className="mt-4 text-sm font-medium text-black hover:text-gray-700 underline"
                            >
                                Ver Galería
                            </button>
                        </div>
                    ))}
                </div>

                {/* Sección de Diseño */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">Diseño y Materiales Innovadores</h2>
                <div className="bg-blue-900 p-8 rounded-xl text-white">
                    <p className="text-2xl font-light italic mb-4">
                        "La calidad de vida en el hogar se mide por la integración inteligente del diseño y la tecnología."
                    </p>
                    <button
                        onClick={() => onNavigate('listing', 'premium')}
                        className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                    >
                        Ver Propiedades con estas Características
                    </button>
                </div>
            </div>

            {/* Modal de Detalle (Si se selecciona una tendencia) */}
            {selectedModal !== null && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedModal(null)}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()} // Evita que el clic cierre el modal
                    >
                        <h3 className="text-2xl font-bold mb-4">{KITCHEN_TRENDS.find(t => t.id === selectedModal)?.title}</h3>
                        <p className="text-gray-700 mb-6">{KITCHEN_TRENDS.find(t => t.id === selectedModal)?.description}</p>
                        
                        {/* Contenido de la galería aquí */}
                        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                            <p className="text-gray-500">Galería de Imágenes (ejemplo)</p>
                        </div>

                        <button 
                            onClick={() => setSelectedModal(null)}
                            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowroomView;
