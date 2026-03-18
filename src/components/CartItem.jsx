import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import CartContext from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useContext(CartContext);
  const { product, quantity } = item;

  const handleIncrease = () => {
    if (quantity < product.stock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-slate-100">
      <Link to={`/product/${product.id}`} className="flex-shrink-0 w-20 h-20 bg-slate-100 rounded-md overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-2 border border-dashed border-slate-300">
            Sin Imagen
          </div>
        )}
      </Link>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <Link to={`/product/${product.id}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-600 line-clamp-2 pr-4">
            {product.name}
          </Link>
          <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {formatPrice(product.price)} c/u
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-slate-200 rounded-md bg-white">
              <button 
                onClick={handleDecrease}
                className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-l-md disabled:opacity-50 transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-medium w-8 text-center">{quantity}</span>
              <button 
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-r-md disabled:opacity-50 transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <button 
              onClick={() => removeItem(product.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
