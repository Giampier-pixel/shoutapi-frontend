import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import CartContext from '../context/CartContext';
import CartItem from '../components/CartItem';
import { orders } from '../api';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
  const { items, total, loading, clear, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCheckout = async () => {
    setError('');
    setCheckingOut(true);
    try {
      const res = await orders.checkout();
      await fetchCart(); // this should technically just be empty since API emptied it, but clear() works too.
      setSuccess(`Orden #${res.data.data.id} creada exitosamente. Redirigiendo...`);
      setTimeout(() => {
        navigate(`/orders/${res.data.data.id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar el pago.');
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 h-64 bg-slate-200 rounded-lg"></div>
          <div className="w-full lg:w-1/3 h-48 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-xl border border-slate-100 shadow-sm mt-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-8">¿Aún no te decides? Tenemos cientos de productos para ti.</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex-1">Tu Carrito</h1>
        {items.length > 0 && (
          <button 
            onClick={clear}
            className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline"
          >
            Vaciar Carrito
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
          {success}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Resumen de tu Orden</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} productos)</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-100">
                <span>Envío</span>
                <span className="font-medium text-green-500">Gratis</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-indigo-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut || items.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
              {checkingOut ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirmar pedido'
              )}
            </button>
            
            <p className="text-xs text-center text-slate-400 mt-4">
              Impuestos incluidos. Envío calculado al final de la compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
