import React from 'react';
import { AlertCircle, AppWindow, Monitor, ShieldCheck, Wrench } from 'lucide-react';
import type { Dataset } from '../types/dataset';

interface DatasetTabsProps {
  datasets: Dataset[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export const DatasetTabs: React.FC<DatasetTabsProps> = ({ datasets, selectedSlug, onSelect }) => {
  const getIcon = (slug: string) => {
    if (slug.includes('perangkat')) return <Monitor className="w-3.5 h-3.5" />;
    if (slug.includes('aplikasi')) return <AppWindow className="w-3.5 h-3.5" />;
    if (slug.includes('lisensi')) return <ShieldCheck className="w-3.5 h-3.5" />;
    if (slug.includes('gangguan')) return <AlertCircle className="w-3.5 h-3.5" />;
    if (slug.includes('pemeliharaan')) return <Wrench className="w-3.5 h-3.5" />;
    return <Monitor className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {datasets.map((d) => {
            const isActive = d.slug === selectedSlug;
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d.slug)}
                className={`group flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition'}>
                  {getIcon(d.slug)}
                </span>
                <span>{d.title}</span>
                <span
                  className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-blue-700 text-white border border-blue-500'
                      : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                  }`}
                >
                  {d.items_count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
