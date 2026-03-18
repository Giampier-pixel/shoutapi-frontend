import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import CartContext from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link
    if (product.stock <= 0) return;
    
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          {product.category && (
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
        </div>
        
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="block text-xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
            <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `Stock: ${product.stock} unid.` : 'Agotado'}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${
              product.stock > 0 
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Agregar al carrito"
          >
            {adding ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
