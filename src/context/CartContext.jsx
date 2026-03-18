import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { cart } from '../api';
import AuthContext from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await cart.getCart();
      dispatch({ type: 'SET_CART', payload: { items: res.data.data } });
    } catch (error) {
      console.error('Failed to fetch cart', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    await cart.addToCart(productId, quantity);
    await fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await cart.updateCartItem(productId, quantity);
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await cart.removeCartItem(productId);
    await fetchCart();
  };

  const clear = async () => {
    await cart.clearCart();
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, updateQuantity, removeItem, clear, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
