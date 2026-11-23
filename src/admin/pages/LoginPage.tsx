import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { storeService } from '../../services/storeService';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@tibranatural.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const ok = storeService.login(email, password);
      setIsLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid credentials. Use admin@tibranatural.com / admin123 or any admin email.');
      }
    }, 400);
  };

  const handleDemoFill = () => {
    setEmail('admin@tibranatural.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 ring-1 ring-white/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-xs font-medium text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spree Commerce CRM Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
            Tibra Natural Store Administrator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Sign in to manage inventory, live orders, prices and sales
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-7 shadow-2xl shadow-black/60">
          {error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@tibranatural.com"
                  className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-zinc-500">Default: admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Spree Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
            >
              Fill Demo Credentials (admin123)
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            >
              ← Back to Storefront
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          Spree v4.x Architecture • Real-Time Dual Synchronized Database • Tibra Natural Joint Care
        </p>
      </div>
    </div>
  );
};
