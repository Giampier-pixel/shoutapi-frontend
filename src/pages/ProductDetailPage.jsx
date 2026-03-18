import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { products as productsApi } from '../api';
import CartContext from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productsApi.getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="w-24 h-6 bg-slate-200 rounded mb-6"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square bg-slate-200 rounded-lg"></div>
          <div className="w-full md:w-1/2 space-y-4 pt-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-200 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 bg-white rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Ups, algo salió mal</h2>
        <p className="text-slate-500 mb-6">{error || 'El producto que buscas no existe o fue eliminado.'}</p>
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al catálogo
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="w-full md:w-1/2 aspect-square bg-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
            ) : (
              <span className="text-slate-400">Sin Imagen</span>
            )}
          </div>
          
          {/* Content */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="mb-2">
              {product.category && (
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            <p className="text-slate-500 mb-8 leading-relaxed">
              {product.description || 'Sin descripción disponible para este producto.'}
            </p>
            
            <div className="mt-auto">
              <div className="flex items-end mb-6">
                <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-24">
                    <label htmlFor="quantity" className="sr-only">Cantidad</label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-12">
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || product.stock <= 0}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        id="quantity"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        disabled={product.stock <= 0}
                        className="w-10 text-center font-medium text-slate-900 border-x border-slate-200 focus:outline-none"
                      />
                      <button 
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock || product.stock <= 0}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || adding}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg h-12 flex items-center justify-center transition-colors shadow-sm disabled:shadow-none"
                  >
                    {adding ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Agregar al carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
