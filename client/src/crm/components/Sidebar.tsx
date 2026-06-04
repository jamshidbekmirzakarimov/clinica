// src/crm/components/Sidebar.tsx
// Yon menyu (Sidebar) navigatsiyasi ombor bo'limlari uchun.
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Package, Users, Truck, ShoppingCart, ArrowLeft } from 'lucide-react';

export function CrmSidebar() {
  const navItems = [
    { name: 'Mahsulotlar', path: '/crm/products', icon: <Package size={20} /> },
    { name: 'Yetkazib beruvchilar', path: '/crm/suppliers', icon: <Truck size={20} /> },
    { name: 'Mijozlar', path: '/crm/customers', icon: <Users size={20} /> },
    { name: 'Buyurtmalar', path: '/crm/orders', icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-400">Ombor CRM</h2>
        <Link to="/" className="text-gray-400 hover:text-white" title="Asosiy menuga qaytish">
          <ArrowLeft size={20} />
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-800">
        &copy; 2026 CRM System
      </div>
    </div>
  );
}
