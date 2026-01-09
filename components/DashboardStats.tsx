import React from 'react';

interface StatsProps {
  stats: { total: number; value: number; flagged: number };
}

const DashboardStats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listados Totales</p>
        <p className="text-3xl font-black text-zinc-900 mt-1">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Valor en Cartera</p>
        <p className="text-3xl font-black text-emerald-600 mt-1">${(stats.value / 1000000).toFixed(1)}M</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Alertas IA</p>
        <p className="text-3xl font-black text-amber-500 mt-1">{stats.flagged}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
