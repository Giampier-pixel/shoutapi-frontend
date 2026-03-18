import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products as productsApi } from '../api';
import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productsApi.getCategories();
        setCategories(res.data.data);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productsApi.getProducts({ page, limit: 12, category, search });
        setProducts(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, category, search]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-4">Filtrar por</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Búsqueda</h3>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Categorías</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="category"
                  checked={category === ''}
                  onChange={() => handleFilterChange('category', '')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Todas</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={category === String(cat.id)}
                    onChange={() => handleFilterChange('category', String(cat.id))}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-600">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => handleFilterChange('page', String(page))} className="text-sm font-medium hover:underline">Reintentar</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 h-64 rounded-lg"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg border border-slate-100 shadow-sm">
            <p className="text-slate-500 mb-4">No se encontraron productos con los filtros seleccionados.</p>
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors font-medium text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button 
                  onClick={() => handleFilterChange('page', String(meta.page - 1))}
                  disabled={meta.page <= 1}
                  className="px-3 py-1 border border-slate-200 rounded-md text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  &lt;
                </button>
                {[...Array(meta.totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handleFilterChange('page', String(i + 1))}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      meta.page === i + 1 
                        ? 'bg-indigo-600 text-white' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => handleFilterChange('page', String(meta.page + 1))}
                  disabled={meta.page >= meta.totalPages}
                  className="px-3 py-1 border border-slate-200 rounded-md text-slate-600 disabled:opacity-50 hover:bg-slate-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
