import React, { useState } from 'react';

interface ShowroomViewProps {
  onGoHome: () => void;
}

const KITCHEN_TRENDS = [
  {
    id: 1,
    title: "Cocinas de Inducción",
    category: "TE MOSTRAMOS AHORA",
    image: "", // Text only logic handled in layout
    description: "Descubre la revolución de la cocina invisible. Superficies de porcelanato que cocinan, limpian y decoran. Una integración perfecta entre tecnología y diseño para el hogar moderno."
  },
  {
    id: 2,
    title: "Inducción Invisible TPB Tech",
    category: "Innovación",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    description: "La encimera desaparece. Cocina directamente sobre la superficie porcelánica."
  },
  {
    id: 3,
    title: "Minimalismo Orgánico",
    category: "Diseño",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    description: "Uso de maderas nobles, piedras naturales sin tratar y líneas curvas."
  },
  {
    id: 4,
    title: "Hornos de Vapor Combinado",
    category: "Electrodomésticos",
    image: "https://images.unsplash.com/photo-1590791182857-96acb4528994?q=80&w=800&auto=format&fit=crop",
    description: "La técnica de los restaurantes Michelin ahora en casa."
  },
  {
    id: 5,
    title: "Grifería Filtrada",
    category: "Sustentabilidad",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800&auto=format&fit=crop",
    description: "Agua hirviendo, fría o con gas directamente del grifo."
  },
  {
    id: 6,
    title: "Iluminación Domótica",
    category: "Ambiente",
    image: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=800&auto=format&fit=crop",
    description: "Escenas de luz programables por voz."
  }
];

const INDUCTION_GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop", title: "TPB Tech® Evolution" },
  { src: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1200&auto=format&fit=crop", title: "Dekton® Slim" },
  { src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop", title: "Silestone® Eternal" }
];

const FEATURES_LIST = [
  "Inducción invisible",
  "Seguridad avanzada",
  "50 % menos de consumo",
  "Reduce riesgo de quemaduras",
  "Superficie tibia, no caliente",
  "Apagado automático"
];

const ShowroomView: React.FC<ShowroomViewProps> = ({ onGoHome }) => {
  const [showInductionGallery, setShowInductionGallery] = useState(false);

  // Split trends for layout: First 3 are the "Main Theme", rest are grid
  const mainThemeItems = KITCHEN_TRENDS.slice(0, 3);
  const otherItems = KITCHEN_TRENDS.slice(3);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <div className="mb-8">
          <button 
            onClick={onGoHome}
            className="flex items-center text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver a Inicio
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <span className="text-[10px] font-bold text-leroy-gold tracking-[0.2em] uppercase mb-3 block">
            Showroom & Tendencias
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-black mb-4 leading-tight">
            Nuevas tecnologías en la cocina
          </h1>
          <p className="font-prata text-lg text-gray-600 max-w-3xl leading-relaxed">
            Tu cocina, más eficiente, cómoda, y linda con todos los avances que te contamos.
          </p>
        </div>

        {/* --- MAIN THEME BLOCK (3 Framed together) --- */}
        <div className="border border-gray-200 shadow-lg rounded-xl overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[450px]">
            
            {/* Box 1: Text & Trend Label */}
            <div 
              className="relative bg-white p-8 md:p-10 flex flex-col justify-center text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowInductionGallery(true)}
            >
              {/* Diagonal Trend Badge */}
              <div className="absolute top-4 -right-10 rotate-45 bg-orange-500 text-white text-[9px] font-bold py-1 w-32 text-center shadow-md z-10">
                ES TENDENCIA
              </div>

              <div className="bg-leroy-black text-white text-[9px] font-bold px-3 py-1 uppercase tracking-widest mb-6 inline-block w-max">
                {mainThemeItems[0].category}
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl text-black mb-6 leading-tight">
                {mainThemeItems[0].title}
              </h3>
              
              <p className="font-prata text-base text-gray-600 leading-relaxed mb-8">
                {mainThemeItems[0].description}
              </p>

              <div className="mt-auto inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-leroy-gold hover:border-leroy-gold transition-colors">
                Ver Galería Completa
              </div>
            </div>

            {/* Box 2: Features with Background Image */}
            <div className="relative bg-gray-900 flex flex-col justify-end p-8 border-b lg:border-b-0 lg:border-r border-gray-100 group overflow-hidden">
               <div className="absolute inset-0 z-0">
                  <img src={mainThemeItems[1].image} alt="Features" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
               </div>
               
               <div className="relative z-10">
                  <h3 className="font-serif text-2xl text-white mb-4">Características</h3>
                  <ul className="space-y-3">
                    {FEATURES_LIST.map((feat, i) => (
                        <li key={i} className="flex items-start text-white/90 font-sans text-xs font-medium">
                            <svg className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            {feat}
                        </li>
                    ))}
                  </ul>
               </div>
            </div>

            {/* Box 3: Third Image */}
            <div className="relative bg-gray-900 group overflow-hidden h-[300px] lg:h-auto">
                <img 
                  src={mainThemeItems[2].image} 
                  alt={mainThemeItems[2].title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-orange-400 mb-2">Diseño</p>
                   <h3 className="font-serif text-2xl text-white">{mainThemeItems[2].title}</h3>
                </div>
            </div>

          </div>
        </div>

        {/* --- REMAINING ITEMS GRID (Complete Images with Text Overlay) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherItems.map((item) => (
            <article 
              key={item.id} 
              className="group cursor-pointer relative overflow-hidden h-80 rounded-lg shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                 <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-1">
                   {item.category}
                 </span>
                 <h3 className="font-serif text-xl text-white mb-1">
                   {item.title}
                 </h3>
                 <p className="text-gray-300 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                 </p>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Modal for Induction Gallery */}
      {showInductionGallery && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex justify-center items-center p-4 overflow-y-auto"
          onClick={() => setShowInductionGallery(false)}
        >
          <div 
            className="w-full max-w-7xl relative my-4 md:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowInductionGallery(false)}
              className="absolute -top-12 right-0 md:-right-4 z-10 text-white hover:text-leroy-gold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Gallery Grid: Full Images with Name Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-0 md:px-0 pb-12 md:pb-0">
               {INDUCTION_GALLERY_IMAGES.map((img, idx) => (
                  <div key={idx} className="relative h-[400px] md:h-[600px] w-full overflow-hidden group">
                      <img 
                         src={img.src} 
                         alt={`Induction Frame ${idx + 1}`} 
                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                          <p className="text-white font-serif text-2xl tracking-wide">
                            {img.title}
                          </p>
                      </div>
                  </div>
               ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowroomView;
