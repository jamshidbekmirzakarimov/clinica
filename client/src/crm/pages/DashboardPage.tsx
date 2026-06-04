import React, { useEffect, useState } from 'react';
import { fetchOrders, fetchProducts, fetchCustomers } from '../lib';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    customersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productCategoryData, setProductCategoryData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [products, customers, orders] = await Promise.all([
        fetchProducts(),
        fetchCustomers(),
        fetchOrders()
      ]);

      // Calculate Stats
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
      setStats({
        productsCount: products.length,
        customersCount: customers.length,
        ordersCount: orders.length,
        totalRevenue
      });

      // Prepare Category Data
      const categories: any = {};
      products.forEach((p: any) => {
        const cat = p.category || 'Boshqa';
        categories[cat] = (categories[cat] || 0) + 1;
      });
      setProductCategoryData(Object.keys(categories).map(key => ({ name: key, value: categories[key] })));

      // Prepare Order Status Data
      const statuses: any = {};
      orders.forEach((o: any) => {
        const status = o.status || 'Noma\'lum';
        statuses[status] = (statuses[status] || 0) + 1;
      });
      setOrderStatusData(Object.keys(statuses).map(key => ({ name: key, value: statuses[key] })));

      // Prepare Revenue Data (Mock grouping by date, simplifying)
      const revByDate: any = {};
      orders.forEach((o: any) => {
        const date = new Date(o.created_at).toLocaleDateString();
        revByDate[date] = (revByDate[date] || 0) + Number(o.total_amount || 0);
      });
      const revChart = Object.keys(revByDate)
        .slice(-7) // oxirgi 7 ta kun
        .map(date => ({ date, amount: revByDate[date] }));
      setRevenueData(revChart);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Bosh sahifa (Dashboard)</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Mahsulotlar</p>
            <p className="text-2xl font-bold text-slate-800">{stats.productsCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Mijozlar</p>
            <p className="text-2xl font-bold text-slate-800">{stats.customersCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Buyurtmalar</p>
            <p className="text-2xl font-bold text-slate-800">{stats.ordersCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Jami daromad</p>
            <p className="text-2xl font-bold text-slate-800">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Daromad (Oxirgi kunlar)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Mahsulot Kategoriyalari</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Buyurtmalar Holati</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
