import React, { useRef, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react';
import { datasetService } from '../services/datasetService';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setMessage(null);
      const res = await datasetService.importFile(selectedFile);
      setMessage({ type: 'success', text: res.message });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.response?.data?.message || err?.message || 'Gagal mengimpor file excel.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportDefaults = async () => {
    try {
      setIsUploading(true);
      setMessage(null);
      const res = await datasetService.importDefaults();
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.response?.data?.message || err?.message || 'Gagal mengimpor kumpulan file default.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-modal w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Import File Excel</h3>
              <p className="text-xs text-slate-500">Sinkronisasi dataset spreadsheet (.xlsx)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Quick Import Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
              Impor Otomatis 5 File Dataset
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Memuat dan menyinkronkan kelima dataset TI standar langsung dari folder berkas sistem.
            </p>
            <button
              onClick={handleImportDefaults}
              disabled={isUploading}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sedang memproses 5 file...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Impor Semua 5 File Sekaligus</span>
                </>
              )}
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Atau Unggah Mandiri
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 hover:border-slate-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 mx-auto rounded-lg bg-white border border-slate-200 group-hover:border-slate-300 text-slate-500 flex items-center justify-center shadow-subtle transition">
              <UploadCloud className="w-5 h-5 text-slate-700" />
            </div>
            <p className="mt-2.5 text-xs font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Pilih berkas Excel (.xlsx)'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Maksimal 20 MB per dokumen</p>
          </div>

          {selectedFile && (
            <button
              onClick={handleUploadFile}
              disabled={isUploading}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah dokumen...</span>
                </>
              ) : (
                <span>Mulai Eksekusi Import</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
