import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            ShopAPI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium">Catálogo</Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-slate-600 hover:text-indigo-600 font-medium">Mis órdenes</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium">Panel Admin</Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-slate-500 hover:text-indigo-600">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="text-slate-500 hover:text-indigo-600 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center text-slate-500 hover:text-indigo-600">
                  <User className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-md shadow-lg py-1 hidden group-hover:block">
                  <span className="block px-4 py-2 text-xs text-slate-400 border-b border-slate-50">{user?.email}</span>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50">Cerrar Sesión</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-slate-500 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-indigo-600 focus:outline-none">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4">
          <Link to="/" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          {isAuthenticated && (
            <Link to="/orders" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Mis órdenes</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="block text-slate-600 font-medium" onClick={() => setIsMenuOpen(false)}>Panel Admin</Link>
          )}
          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <>
                <div className="mb-2">
                  <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="text-red-600 text-sm font-medium">Cerrar Sesión</button>
              </>
            ) : (
              <Link to="/login" className="text-indigo-600 text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
