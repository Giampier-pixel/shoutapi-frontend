import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders as ordersApi } from '../api';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { formatPrice } from '../utils/formatPrice';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await ordersApi.getMyOrders({ page, limit: 10 });
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      setError('Error al cargar tus órdenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && orders.length === 0) {
    return <div className="p-8 text-center text-slate-500">Cargando órdenes...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md text-center">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Aún no tienes órdenes</h2>
        <p className="text-slate-500 mb-6">Anímate a realizar tu primera compra en nuestra tienda.</p>
        <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Explorar Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Mis Órdenes</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Orden</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((order) => {
                const totalItems = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
                const formattedDate = new Date(order.created_at || order.createdAt).toLocaleDateString('es-PE', {
                  year: 'numeric', month: 'short', day: 'numeric'
                });
                
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-indigo-600">
                      #{String(order.id).padStart(5, '0')}
                    </td>
                    <td className="px-6 py-4">{formattedDate}</td>
                    <td className="px-6 py-4 text-center">{totalItems}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                      >
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
