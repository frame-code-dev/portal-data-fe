import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Dataset, DatasetItem, ItemFormData } from '../types/dataset';

interface ItemModalProps {
  isOpen: boolean;
  dataset: Dataset | null;
  editingItem: DatasetItem | null;
  onClose: () => void;
  onSave: (data: ItemFormData) => Promise<void>;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  dataset,
  editingItem,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ItemFormData>({
    code: '',
    name: '',
    category: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    value: 0,
    status: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        code: editingItem.code || '',
        name: editingItem.name || '',
        category: editingItem.category || (dataset?.categories?.[0] || ''),
        unit: editingItem.unit || '',
        date: editingItem.date || new Date().toISOString().split('T')[0],
        value: editingItem.value || 0,
        status: editingItem.status || (dataset?.statuses?.[0] || ''),
        notes: editingItem.notes || '',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        category: dataset?.categories?.[0] || '',
        unit: '',
        date: new Date().toISOString().split('T')[0],
        value: 0,
        status: dataset?.statuses?.[0] || '',
        notes: '',
      });
    }
    setError(null);
  }, [editingItem, dataset, isOpen]);

  if (!isOpen || !dataset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setError('Kode wajib diisi.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-modal w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {editingItem ? 'Edit Data Record' : 'Tambah Data Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Modul: {dataset.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: IT1-021"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nama Item / Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Deskripsi singkat item"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-medium transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition cursor-pointer"
              >
                {dataset.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition cursor-pointer"
              >
                {dataset.statuses?.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Unit Kerja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Sekretariat"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                {dataset.value_label} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                placeholder="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Catatan
            </label>
            <textarea
              rows={2}
              placeholder="Deskripsi atau catatan opsional"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : editingItem ? 'Perbarui Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
