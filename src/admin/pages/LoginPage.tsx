import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { storeService } from '../../services/storeService';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@tibranaturals.com');
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
        setError('Invalid credentials. Use admin@tibranaturals.com / admin123 or any admin email.');
      }
    }, 400);
  };

  const handleDemoFill = () => {
    setEmail('admin@tibranaturals.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col justify-center items-center p-4 selection:bg-[#748C48] selection:text-white relative">
      {/* Background ambient accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#748C48]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[300px] bg-[#252E15]/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#252E15] flex items-center justify-center shadow-lg shadow-[#252E15]/20 mb-3 border border-[#3E4D23]">
            <ShieldCheck className="w-7 h-7 text-[#C5E18A]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#748C48]/15 border border-[#748C48]/30 text-xs font-semibold text-[#252E15] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#748C48]" />
            <span>Spree Commerce CRM Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#252E15] font-serif">
            TIBRA NATURALS Store Administrator
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Sign in to manage inventory, live orders, prices and sales
          </p>
        </div>

        {/* Auth Card - Crisp White Luxury Light Card */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-7 sm:p-8 shadow-xl shadow-zinc-200/70">
          {error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@tibranaturals.com"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white focus:ring-1 focus:ring-[#748C48] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-zinc-500">Default: admin123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#748C48] focus:bg-white focus:ring-1 focus:ring-[#748C48] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#748C48] hover:bg-[#5F7339] active:scale-[0.99] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#748C48]/30 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[#748C48] hover:text-[#5F7339] font-semibold underline underline-offset-4 cursor-pointer"
            >
              Fill Demo Credentials (admin123)
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="text-zinc-500 hover:text-zinc-800 transition cursor-pointer font-medium"
            >
              ← Back to Storefront
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <p className="text-center text-xs text-zinc-500 mt-6">
          TIBRA NATURALS • Authentic Botanical Wellness Pakistan
        </p>
      </div>
    </div>
  );
};
