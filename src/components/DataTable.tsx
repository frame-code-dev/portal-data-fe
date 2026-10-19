import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import type { Dataset, DatasetItem, PaginationMeta } from '../types/dataset';

interface DataTableProps {
  dataset: Dataset | null;
  items: DatasetItem[];
  pagination: PaginationMeta | null;
  search: string;
  category: string;
  status: string;
  loading: boolean;
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPageChange: (page: number) => void;
  onReload: () => void;
  onAddNew: () => void;
  onEdit: (item: DatasetItem) => void;
  onDelete: (item: DatasetItem) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  dataset,
  items,
  pagination,
  search,
  category,
  status,
  loading,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onPageChange,
  onReload,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (s: string) => {
    const lower = s.toLowerCase();
    let style = 'bg-slate-50 text-slate-700 border-slate-200';

    if (lower.includes('nonaktif') || lower.includes('rusak') || lower.includes('akhir') || lower.includes('batal')) {
      style = 'bg-rose-50 text-rose-800 border-rose-200/90';
    } else if (lower.includes('aktif') || lower.includes('tersedia') || lower.includes('selesai')) {
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200/90';
    } else if (
      lower.includes('proses') ||
      lower.includes('kerja') ||
      lower.includes('uji') ||
      lower.includes('evaluasi') ||
      lower.includes('rencana') ||
      lower.includes('guna')
    ) {
      style = 'bg-amber-50 text-amber-800 border-amber-200/90';
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${style}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode, nama, unit, catatan..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="py-1.5 pl-2.5 pr-7 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {dataset?.categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="py-1.5 pl-2.5 pr-7 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-700 cursor-pointer"
          >
            <option value="">Semua Status</option>
            {dataset?.statuses?.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={onReload}
            disabled={loading}
            title="Muat ulang tabel"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        {/* Action Button: Add Item */}
        <div>
          <button
            onClick={onAddNew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3 w-12 text-center">No</th>
              <th scope="col" className="px-4 py-3">Kode</th>
              <th scope="col" className="px-4 py-3">Nama Item / Kegiatan</th>
              <th scope="col" className="px-4 py-3">Kategori</th>
              <th scope="col" className="px-4 py-3">Unit Kerja</th>
              <th scope="col" className="px-4 py-3">Tanggal</th>
              <th scope="col" className="px-4 py-3 text-right">
                {dataset?.value_label || 'Nilai (Rp)'}
              </th>
              <th scope="col" className="px-4 py-3 text-center">Status</th>
              <th scope="col" className="px-4 py-3">Catatan</th>
              <th scope="col" className="px-4 py-3 text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center text-slate-500">
                  <div className="inline-flex items-center gap-2 text-xs font-medium">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Sinkronisasi data tabel...</span>
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center text-slate-500">
                  <div className="max-w-xs mx-auto text-center">
                    <p className="font-bold text-slate-800 text-sm">Tidak ada baris data</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Data tidak ditemukan dengan kriteria filter saat ini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const rowNumber = pagination
                  ? (pagination.current_page - 1) * pagination.per_page + idx + 1
                  : idx + 1;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-2.5 text-center text-xs text-slate-400 tabular-nums">
                      {rowNumber}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-xs text-slate-900 whitespace-nowrap">
                      {item.code}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-900 max-w-[200px] truncate" title={item.name}>
                      {item.name}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">
                      {item.unit}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                      {formatRupiah(item.value)}
                    </td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs max-w-[180px] truncate" title={item.notes || ''}>
                      {item.notes || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit baris"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          title="Hapus baris"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.total > 0 && (
        <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <span className="font-bold text-slate-800 tabular-nums">
              {(pagination.current_page - 1) * pagination.per_page + 1}
            </span>{' '}
            –{' '}
            <span className="font-bold text-slate-800 tabular-nums">
              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
            </span>{' '}
            dari <span className="font-bold text-slate-800 tabular-nums">{pagination.total}</span> data
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2.5 py-0.5 font-bold tabular-nums text-slate-700 bg-white rounded border border-slate-200 text-xs">
              {pagination.current_page} / {pagination.last_page}
            </span>

            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="p-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
