// src/crm/pages/CustomersPage.tsx
// Mijozlarni boshqarish sahifasi.
import React, { useState, useEffect } from 'react';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../lib/customers';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data || []);
    } catch (err) { toast.error("Xatolik yuz berdi"); } finally { setLoading(false); }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Nomini kiriting");
    try {
      if (editingId) {
        await updateCustomer(editingId, formData);
        toast.success("Muvaffaqiyatli yangilandi");
      } else {
        await createCustomer(formData);
        toast.success("Yangi mijoz qo'shildi");
      }
      setShowModal(false);
      loadData();
    } catch (err) { toast.error("Saqlashda xatolik"); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try { await deleteCustomer(id); toast.success("O'chirildi"); loadData(); } catch (err) { toast.error("O'chirishda xatolik"); }
  };

  const handleOpenModal = (cust: any = null) => {
    if (cust) { setEditingId(cust.id); setFormData({ name: cust.name, phone: cust.phone || '', address: cust.address || '' }); }
    else { setEditingId(null); setFormData({ name: '', phone: '', address: '' }); }
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mijozlar</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Qo'shish
        </button>
      </div>

      {loading ? <div className="text-center py-10">Yuklanmoqda...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Nomi</th>
                <th className="p-4 font-semibold text-gray-600">Telefon</th>
                <th className="p-4 font-semibold text-gray-600">Manzil</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">#{c.id}</td>
                  <td className="p-4 font-medium text-gray-800">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.phone || '-'}</td>
                  <td className="p-4 text-gray-600">{c.address || '-'}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleOpenModal(c)} className="text-blue-500 hover:text-blue-700"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Tahrirlash" : "Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Nomi *</label><input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">Telefon</label><input type="text" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">Manzil</label><input type="text" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
