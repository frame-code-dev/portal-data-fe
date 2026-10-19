import React from 'react';
import { Coins, Database, Layers } from 'lucide-react';
import type { DatasetSummary } from '../types/dataset';

interface StatsCardProps {
  summary: DatasetSummary | null;
}

export const StatsCard: React.FC<StatsCardProps> = ({ summary }) => {
  if (!summary) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('nonaktif') || s.includes('rusak') || s.includes('batal') || s.includes('akhir')) {
      return 'bg-rose-50 text-rose-800 border-rose-200/90';
    }
    if (s.includes('aktif') || s.includes('tersedia') || s.includes('selesai')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
    }
    if (
      s.includes('proses') ||
      s.includes('kerja') ||
      s.includes('uji') ||
      s.includes('evaluasi') ||
      s.includes('rencana') ||
      s.includes('guna')
    ) {
      return 'bg-amber-50 text-amber-800 border-amber-200/90';
    }
    return 'bg-rose-50 text-rose-800 border-rose-200/90';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Items */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-card hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Record Data
          </span>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {summary.total_items}
          </span>
          <span className="text-xs text-slate-400 font-medium">baris entri</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500 truncate">
          Modul: <span className="font-semibold text-slate-700">{summary.dataset.title}</span>
        </p>
      </div>

      {/* Total Finansial / Nilai */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-card hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate pr-2">
            {summary.dataset.value_label}
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {formatRupiah(summary.total_value)}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Akumulasi nilai finansial terintegrasi
        </p>
      </div>

      {/* Distribusi Status */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-card hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Sebaran Status
          </span>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {Object.entries(summary.status_counts).length === 0 ? (
            <span className="text-xs text-slate-400">Tidak ada data</span>
          ) : (
            Object.entries(summary.status_counts).map(([status, count]) => (
              <span
                key={status}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusBadgeStyle(
                  status
                )}`}
              >
                <span>{status}:</span>
                <span className="font-bold tabular-nums">{count}</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
