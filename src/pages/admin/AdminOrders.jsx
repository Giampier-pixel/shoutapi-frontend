import React, { useState, useEffect } from 'react';
import { orders as ordersApi } from '../../api';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import { formatPrice } from '../../utils/formatPrice';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(null); // id de la orden que se está actualizando

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAllOrders({ page, limit: 10 });
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      setError('Error al cargar órdenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      // actualizar localmente para evitar refetch completo si es preferible
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Órdenes</h1>
        <p className="text-slate-500 mt-1">Supervisión y actualización de pedidos</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Orden ID</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Estado Actual</th>
                <th className="px-6 py-4">Cambiar Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 animate-pulse">Cargando órdenes...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No hay órdenes en el sistema.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const formattedDate = new Date(order.created_at || order.createdAt).toLocaleDateString('es-PE', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                  });
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-indigo-600">
                        #{String(order.id).padStart(5, '0')}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        Usuario {order.user_id}
                      </td>
                      <td className="px-6 py-4">{formattedDate}</td>
                      <td className="px-6 py-4 text-right font-medium">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-center">
                        {updating === order.id ? (
                          <span className="text-slate-400 text-xs animate-pulse">Guardando...</span>
                        ) : (
                          <OrderStatusBadge status={order.status} />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="text-sm bg-white border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Página {meta.page} de {meta.totalPages}</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 disabled:opacity-50"
              >
                Anterior
              </button>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
