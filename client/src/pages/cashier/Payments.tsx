import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Filter, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Payment } from '../../types';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export function CashierPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsPageLoading(true);
    try {
      // In a real app, you might have a dedicated GET /api/cashier/payments
      // For now, let's assume we can fetch them or we'll need to add the endpoint.
      // Checking backend... wait, I didn't add GET payments to cashier.controller.ts!
      // I'll need to add it.
      const response = await api.get('/cashier/payments');
      setPayments(response.data.payments);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setIsPageLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-slate-500 mt-1">Track and manage patient transactions.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600 shadow-sm">
                <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm font-bold shadow-md">
                <DollarSign className="w-4 h-4" /> Export Report
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name or appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Paid</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pending</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-black tracking-widest">Transaction Info</th>
                <th className="px-6 py-4 font-black tracking-widest">Patient / Doctor</th>
                <th className="px-6 py-4 font-black tracking-widest">Amount</th>
                <th className="px-6 py-4 font-black tracking-widest">Status</th>
                <th className="px-6 py-4 font-black tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
               {isPageLoading ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Transactions...</p>
                    </td>
                 </tr>
               ) : payments.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <CreditCard className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No payments found in system</p>
                    </td>
                 </tr>
               ) : payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900">APP-{payment.appointment_id}</span>
                        <span className="text-[10px] text-slate-400 font-medium">TXN-{payment.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{payment.patient_name}</span>
                        <span className="text-[10px] text-primary-600 font-bold uppercase">To: {payment.doctor_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900">{payment.amount.toLocaleString()} UZS</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                    ) : payment.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                            <Clock className="w-3 h-3" /> Pending
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-100">
                            <AlertCircle className="w-3 h-3" /> Failed
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400 text-xs font-bold">
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}