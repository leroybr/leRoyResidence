
import React from 'react';
import { PropertyType, SearchFilters, ListingType } from '../types';
import { COMMUNES } from '../constants';

interface SidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onClear }) => {
  const handleChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 space-y-12 pr-12 border-r border-gray-100 hidden md:block">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Operación</h3>
        <div className="flex gap-2">
           <button 
             onClick={() => handleChange('listingType', ListingType.SALE)}
             className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${filters.listingType === ListingType.SALE ? 'bg-leroy-orange text-white border-leroy-orange' : 'bg-white text-gray-400 border-gray-200 hover:border-leroy-orange'}`}
           >
             Venta
           </button>
           <button 
             onClick={() => handleChange('listingType', ListingType.RENT)}
             className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${filters.listingType === ListingType.RENT ? 'bg-leroy-orange text-white border-leroy-orange' : 'bg-white text-gray-400 border-gray-200 hover:border-leroy-orange'}`}
           >
             Arriendo
           </button>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Ubicación</h3>
        <select 
          value={filters.location || ''} 
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full bg-white border border-gray-200 p-3 text-xs focus:border-leroy-orange outline-none transition-all"
        >
          <option value="all">Todas las ubicaciones</option>
          {COMMUNES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button 
        onClick={onClear}
        className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-leroy-orange border border-leroy-orange hover:bg-leroy-orange hover:text-white transition-all"
      >
        Limpiar Filtros
      </button>
    </aside>
  );
};

export default Sidebar;

