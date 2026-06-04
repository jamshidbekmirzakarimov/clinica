import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Package } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Tizimni tanlang</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Klinika */}
          <Link to="/login" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center group">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Klinika Tizimi</h2>
            <p className="text-gray-500 text-center">Bemorlar, shifokorlar, qabullar va to'lovlarni boshqarish tizimi</p>
          </Link>

          {/* Omborxona */}
          <Link to="/crm/login" className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center group">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Package size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Omborxona & CRM</h2>
            <p className="text-gray-500 text-center">Kiyim-kechak mahsulotlari, yetkazib beruvchilar va mijozlar buyurtmalarini boshqarish</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
