// src/crm/pages/ProductsPage.tsx
// Mahsulotlarni ko'rsatish, qo'shish, tahrirlash va o'chirish sahifasi.
import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../lib/products';
import { fetchSuppliers } from '../lib/suppliers';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';

export function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Form holatlari
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: 0, stock: 0, supplier_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  async function loadData(searchQuery = '') {
    try {
      setLoading(true);
      const [prods, sups] = await Promise.all([fetchProducts(searchQuery), fetchSuppliers()]);
      setProducts(prods || []);
      setSuppliers(sups || []);
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (prod: any = null) => {
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        name: prod.name,
        category: prod.category || '',
        price: prod.price || 0,
        stock: prod.stock || 0,
        supplier_id: prod.supplier_id?.toString() || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', category: '', price: 0, stock: 0, supplier_id: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Nomini kiriting");
    if (formData.price < 0 || formData.stock < 0) return toast.error("Manfiy qiymat kiritmang");

    try {
      const payload = {
        ...formData,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success("Muvaffaqiyatli yangilandi");
      } else {
        await createProduct(payload);
        toast.success("Yangi mahsulot qo'shildi");
      }
      setShowModal(false);
      loadData(search);
    } catch (err) {
      toast.error("Saqlashda xatolik");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await deleteProduct(id);
      toast.success("O'chirildi");
      loadData(search);
    } catch (err) {
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mahsulotlar</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Qo'shish
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3">
        <Search className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Nomi yoki kategoriya bo'yicha qidiruv..." 
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Yuklanmoqda...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Nomi</th>
                <th className="p-4 font-semibold text-gray-600">Kategoriya</th>
                <th className="p-4 font-semibold text-gray-600">Narxi</th>
                <th className="p-4 font-semibold text-gray-600">Qoldiq</th>
                <th className="p-4 font-semibold text-gray-600">Ta'minotchi</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">#{p.id}</td>
                  <td className="p-4 font-medium text-gray-800">{p.name}</td>
                  <td className="p-4 text-gray-600">{p.category || '-'}</td>
                  <td className="p-4 text-gray-600">{p.price?.toLocaleString()} UZS</td>
                  <td className="p-4 text-gray-600">{p.stock} dona</td>
                  <td className="p-4 text-gray-600">{p.suppliers?.name || '-'}</td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleOpenModal(p)} className="text-blue-500 hover:text-blue-700"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">Ma'lumot topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Tahrirlash" : "Qo'shish"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nomi <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategoriya</label>
                <input type="text" className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Narxi</label>
                  <input type="number" min="0" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Qoldiq</label>
                  <input type="number" min="0" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ta'minotchi</label>
                <select className="w-full border p-2 rounded" value={formData.supplier_id} onChange={e => setFormData({...formData, supplier_id: e.target.value})}>
                  <option value="">Tanlang</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
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
