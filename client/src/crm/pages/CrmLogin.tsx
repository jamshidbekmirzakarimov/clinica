import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Package, Lock, Mail, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { AuthResponse } from '../../types';
import { toast } from 'react-toastify';

export function CrmLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { user, tokens } = response.data;

      login(user, tokens);
      toast.success(`Xush kelibsiz, ${user.fullname}! Omborxonaga kirildi.`);
      
      // Redirect to CRM Dashboard
      navigate('/crm/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email yoki parol noto\'g\'ri');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center text-emerald-600">
          <div className="p-4 bg-white shadow-xl shadow-emerald-200/50 rounded-2xl border border-emerald-50 transform transition hover:scale-105 duration-300">
            <Package className="w-12 h-12" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Omborxona CRM
        </h2>
        <p className="mt-3 text-center text-base text-slate-500 font-medium">
          Tizimga kirish uchun ma'lumotlarni kiriting
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-12 border border-white">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error &&
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            }

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700">
                Email manzil
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 sm:text-sm border-slate-200 bg-slate-50/50 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 py-3 border transition-all duration-200 hover:bg-white"
                  placeholder="admin@crm.com" />
                
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700">
                Parol
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 sm:text-sm border-slate-200 bg-slate-50/50 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 py-3 border transition-all duration-200 hover:bg-white"
                  placeholder="••••••••" />
                
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/30 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Kirish'
                )}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
