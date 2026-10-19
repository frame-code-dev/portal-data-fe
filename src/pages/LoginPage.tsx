import React, { useState } from 'react';
import { ArrowRight, Database, KeyRound, Loader2, Lock, ShieldCheck, User } from 'lucide-react';
import { authService } from '../services/authService';
import type { User as UserType } from '../types/auth';

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await authService.login(username, password);
      onLoginSuccess(res.data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Kredensial tidak valid. Silakan periksa kembali.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('password');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-blue-100">
      {/* Subtle architectural background texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-card border border-slate-800">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          PortaData Enterprise
        </h1>
        <p className="mt-1 text-center text-xs font-medium text-slate-500">
          Sistem Pengelolaan & Integrasi Master Dataset TI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200/90 shadow-card">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Autentikasi Pengguna
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan kredensial akun administrator
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS / Sanctum</span>
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 font-medium transition"
                />
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 text-xs transition group"
              >
                <div className="flex items-center gap-2 text-slate-600">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition" />
                  <span className="text-slate-500">Kredensial Demo:</span>
                  <span className="font-mono font-bold text-slate-800">admin / password</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 group-hover:underline">
                  Isi Otomatis
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Dilindungi oleh otentikasi sesi token terenkripsi.
        </p>
      </div>
    </div>
  );
};
