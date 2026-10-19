import React from 'react';
import { Database, LogOut, UploadCloud } from 'lucide-react';
import type { User } from '../types/auth';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenImport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenImport }) => {
  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm border border-blue-500">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                PortaData
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 -mt-0.5">
              Enterprise Dataset Management
            </p>
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-subtle hover:border-slate-300 transition"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Import Excel</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* User badge */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 uppercase">
              {user?.username?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || user?.username || 'Administrator'}
              </p>
              <p className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
