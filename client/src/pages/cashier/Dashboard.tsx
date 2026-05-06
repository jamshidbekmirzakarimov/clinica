import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

export function CashierDashboard() {
  const [stats, setStats] = useState({
    todayPatients: 0,
    todayAppointments: 0,
    todayRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Assuming we have a stats endpoint or we calculate from lists
      const [pRes, payRes] = await Promise.all([
        api.get('/cashier/patients'),
        api.get('/cashier/payments')
      ]);
      
      const payments = payRes.data.payments;
      const today = new Date().toISOString().split('T')[0];
      
      const todayPay = payments.filter((p: any) => p.created_at?.startsWith(today));
      const revenue = todayPay.reduce((acc: number, curr: any) => acc + (curr.status === 'paid' ? parseFloat(curr.amount) : 0), 0);
      const pending = payments.filter((p: any) => p.status === 'pending').length;

      setStats({
        todayPatients: pRes.data.patients.length,
        todayAppointments: todayPay.length,
        todayRevenue: revenue,
        pendingPayments: pending
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats');
    }
  };

  const statCards = [
    { title: 'Total Patients', value: stats.todayPatients, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { title: "Today's Visits", value: stats.todayAppointments, icon: Calendar, color: 'bg-purple-500', trend: '+5%' },
    { title: "Today's Revenue", value: `${stats.todayRevenue.toLocaleString()} UZS`, icon: DollarSign, color: 'bg-green-500', trend: '+20%' },
    { title: 'Pending Payments', value: stats.pendingPayments, icon: Clock, color: 'bg-amber-500', trend: '-2%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cashier Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-black text-slate-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <a href="/cashier/patients" className="p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 border-2 border-transparent hover:border-primary-100 transition-all text-center space-y-2 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:text-primary-600">
                    <Users className="w-5 h-5" />
                </div>
                <span className="block text-sm font-bold text-slate-700">New Patient</span>
             </a>
             <a href="/cashier/appointment" className="p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 border-2 border-transparent hover:border-primary-100 transition-all text-center space-y-2 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:text-primary-600">
                    <Calendar className="w-5 h-5" />
                </div>
                <span className="block text-sm font-bold text-slate-700">Appointment</span>
             </a>
             <a href="/cashier/payments" className="p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 border-2 border-transparent hover:border-primary-100 transition-all text-center space-y-2 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:text-primary-600">
                    <DollarSign className="w-5 h-5" />
                </div>
                <span className="block text-sm font-bold text-slate-700">Payments</span>
             </a>
             <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 opacity-50">
                <span className="text-xs font-bold text-slate-400">Coming Soon</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <TrendingUp className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black">Daily Performance</h3>
                        <p className="text-slate-400 text-xs font-bold">Your productivity is up by 15%</p>
                    </div>
                </div>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                            <span>Target Achievement</span>
                            <span>85%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(var(--primary-500),0.5)]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-medium text-slate-400">+12 other staff active</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}