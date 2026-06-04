// src/crm/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Package, Users, Truck, ShoppingCart, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export function CrmSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/crm/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Mahsulotlar', path: '/crm/products', icon: <Package size={20} /> },
    { name: 'Yetkazib beruvchilar', path: '/crm/suppliers', icon: <Truck size={20} /> },
    { name: 'Mijozlar', path: '/crm/customers', icon: <Users size={20} /> },
    { name: 'Buyurtmalar', path: '/crm/orders', icon: <ShoppingCart size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-xl font-bold text-emerald-400">Ombor CRM</h2>
        {user && (
          <p className="text-xs text-gray-400 mt-1 truncate">{user.fullname}</p>
        )}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Chiqish</span>
        </button>
      </div>
      <div className="p-4 text-xs text-gray-500 text-center border-t border-gray-800">
        &copy; 2026 CRM System
      </div>
    </div>
  );
}
