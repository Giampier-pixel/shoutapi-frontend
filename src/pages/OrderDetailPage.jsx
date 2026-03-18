import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { orders as ordersApi } from '../api';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { formatPrice } from '../utils/formatPrice';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await ordersApi.getMyOrderById(id);
        setOrder(res.data.data);
      } catch (err) {
        setError('No se pudo cargar la orden. Puede que no exista o no te pertenezca.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando detalles...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Volver a mis órdenes
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.created_at || order.createdAt).toLocaleDateString('es-PE', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/orders" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a mis órdenes
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Orden <span className="text-indigo-600 font-mono">#{String(order.id).padStart(5, '0')}</span>
            </h1>
            <p className="text-slate-500 text-sm">Realizada el {formattedDate}</p>
          </div>
          <div className="self-start sm:self-auto">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Artículos ({(order.items || []).reduce((a, b) => a + b.quantity, 0)})</h2>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium text-center">Cant.</th>
                  <th className="px-4 py-3 font-medium text-right">Precio Unit.</th>
                  <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(order.items || []).map((item) => (
                  <tr key={item.id} className="bg-white">
                    <td className="px-4 py-4 min-w-[200px]">
                      <div className="flex items-center">
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded bg-slate-100 mr-3" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 mr-3 hidden sm:block"></div>
                        )}
                        <span className="font-medium text-slate-800 line-clamp-2">{item.product?.name || 'Producto eliminado'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{formatPrice(item.unit_price)}</td>
                    <td className="px-4 py-4 text-right font-medium text-slate-900">{formatPrice(item.unit_price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full sm:w-1/2 md:w-1/3 space-y-3">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm pb-3 border-b border-slate-100">
                <span>Envío</span>
                <span className="text-green-500">Gratis</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Total Pagado</span>
                <span className="font-bold text-indigo-600 text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
