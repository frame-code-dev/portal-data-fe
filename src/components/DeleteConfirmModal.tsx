import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { DatasetItem } from '../types/dataset';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: DatasetItem | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-modal w-full max-w-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-200/80 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Hapus entri <span className="font-mono font-bold text-slate-800">{item.code}</span> (
              {item.name}) secara permanen?
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};
