import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { orders as ordersApi, products as productsApi } from '../../api';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeOrderCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
          ordersApi.getAllOrders({ limit: 100 }), // simplified for demo
          productsApi.getProducts({ limit: 1 }) // just need meta.total
        ]);
        
        const orders = ordersRes.data.data;
        const totalRev = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const active = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
        
        setStats({
          totalOrders: ordersRes.data.meta.total,
          totalRevenue: totalRev,
          totalProducts: productsRes.data.meta.total,
          activeOrderCount: active
        });
      } catch (err) {
        console.error('Error fetching admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando estadísticas...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="text-slate-500 mt-1">Resumen general de la tienda</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
            <p className="text-2xl font-bold text-slate-900">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Órdenes Totales</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mr-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Órdenes Pendientes</p>
            <p className="text-2xl font-bold text-slate-900">{stats.activeOrderCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Productos Activos</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Gestión de Catálogo</h2>
          <p className="text-slate-500 mb-6 text-sm">Agrega, edita o elimina productos y categorías de tu tienda.</p>
          <Link to="/admin/products" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded hover:bg-indigo-100 transition-colors">
            Gestionar Productos
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Gestión de Órdenes</h2>
          <p className="text-slate-500 mb-6 text-sm">Visualiza todas las órdenes y actualiza su estado de envío.</p>
          <Link to="/admin/orders" className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded hover:bg-indigo-100 transition-colors">
            Ver todas las Órdenes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
