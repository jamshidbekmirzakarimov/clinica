// src/crm/pages/OrdersPage.tsx
// Buyurtmalar bilan ishlash, yangi buyurtma va uning ichiga mahsulotlar qo'shish sahifasi.
import React, { useState, useEffect } from 'react';
import { fetchOrders, createOrderWithItems, updateOrderStatus, deleteOrder, calculateOrderTotal } from '../lib/orders';
import { fetchCustomers } from '../lib/customers';
import { fetchProducts } from '../lib/products';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('new');
  const [orderItems, setOrderItems] = useState<any[]>([]); // { product_id, quantity, unit_price, max_stock, name }

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [ordRes, custRes, prodRes] = await Promise.all([fetchOrders(), fetchCustomers(), fetchProducts()]);
      setOrders(ordRes || []);
      setCustomers(custRes || []);
      setProducts(prodRes || []);
    } catch (err) { toast.error("Xatolik yuz berdi"); } finally { setLoading(false); }
  }

  const handleOpenModal = () => {
    setCustomerId('');
    setStatus('new');
    setOrderItems([]);
    setShowModal(true);
  };

  const handleAddItem = (productId: string) => {
    if(!productId) return;
    const prod = products.find(p => p.id.toString() === productId);
    if (!prod) return;
    
    // Check if already added
    if (orderItems.some(i => i.product_id === prod.id)) {
      return toast.warn("Bu mahsulot qo'shilgan");
    }

    setOrderItems([...orderItems, { 
      product_id: prod.id, 
      quantity: 1, 
      unit_price: prod.price, 
      max_stock: prod.stock, 
      name: prod.name 
    }]);
  };

  const updateItemQty = (index: number, qty: number) => {
    const newItems = [...orderItems];
    if (qty > newItems[index].max_stock) {
      toast.warn("Bazada buncha qoldiq yo'q");
      return;
    }
    newItems[index].quantity = qty < 1 ? 1 : qty;
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return toast.error("Mijozni tanlang");
    if (orderItems.length === 0) return toast.error("Kamida 1 ta mahsulot qo'shing");

    try {
      await createOrderWithItems(parseInt(customerId), status, orderItems);
      toast.success("Yangi buyurtma yaratildi");
      setShowModal(false);
      loadData();
    } catch (err) { toast.error("Saqlashda xatolik"); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("O'chirmoqchimisiz?")) return;
    try { await deleteOrder(id); toast.success("O'chirildi"); loadData(); } catch (err) { toast.error("Xatolik"); }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try { await updateOrderStatus(id, newStatus); toast.success("Status o'zgardi"); loadData(); } catch (err) { toast.error("Xatolik"); }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buyurtmalar</h1>
        <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Yangi Buyurtma
        </button>
      </div>

      {loading ? <div className="text-center py-10">Yuklanmoqda...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Mijoz</th>
                <th className="p-4 font-semibold text-gray-600">Sana</th>
                <th className="p-4 font-semibold text-gray-600">Summa</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 text-gray-500">#{o.id}</td>
                  <td className="p-4 font-medium text-gray-800">{o.customers?.name || '-'}</td>
                  <td className="p-4 text-gray-600">{new Date(o.order_date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-600 font-medium text-green-600">
                    {calculateOrderTotal(o.order_items).toLocaleString()} UZS
                  </td>
                  <td className="p-4">
                    <select 
                      value={o.status} 
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm font-medium outline-none
                        ${o.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                          o.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="new">Yangi (New)</option>
                      <option value="paid">To'langan (Paid)</option>
                      <option value="shipped">Yetkazilgan (Shipped)</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => handleDelete(o.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Yangi Buyurtma</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mijozni tanlang *</label>
                  <select required className="w-full border p-2 rounded" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                    <option value="">Tanlang</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dastlabki Status</label>
                  <select className="w-full border p-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="new">Yangi</option>
                    <option value="paid">To'langan</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Mahsulotlarni qo'shish</h3>
                <div className="flex gap-2 mb-4">
                  <select 
                    className="flex-1 border p-2 rounded" 
                    onChange={e => { handleAddItem(e.target.value); e.target.value = ''; }}
                    defaultValue=""
                  >
                    <option value="" disabled>Ro'yxatdan mahsulot tanlang...</option>
                    {products.filter(p => p.stock > 0).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {p.price} UZS (Qoldiq: {p.stock})</option>
                    ))}
                  </select>
                </div>

                {orderItems.length > 0 && (
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-2 text-left">Nomi</th>
                        <th className="p-2 text-left">Narxi</th>
                        <th className="p-2 text-center">Miqdori</th>
                        <th className="p-2 text-right">Summa</th>
                        <th className="p-2 text-center">X</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.unit_price}</td>
                          <td className="p-2 text-center">
                            <input type="number" min="1" max={item.max_stock} value={item.quantity} 
                              onChange={e => updateItemQty(idx, parseInt(e.target.value))} 
                              className="w-16 border rounded text-center p-1" />
                          </td>
                          <td className="p-2 text-right">{(item.unit_price * item.quantity).toLocaleString()}</td>
                          <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => removeItem(idx)}>O'chirish</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={3} className="p-2 text-right">Jami:</td>
                        <td className="p-2 text-right text-green-600">
                          {orderItems.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0).toLocaleString()} UZS
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded">Bekor qilish</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Buyurtmani Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
