import React, { createContext, useReducer, useEffect } from 'react';
import { auth, setAccessToken } from '../api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await auth.refresh();
        setAccessToken(response.data.data.accessToken);
        const userRes = await auth.getMe();
        dispatch({ type: 'LOGIN', payload: { user: userRes.data.data } });
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await auth.login(credentials);
    setAccessToken(response.data.data.accessToken);
    dispatch({ type: 'LOGIN', payload: { user: response.data.data.user } });
    return response.data;
  };

  const register = async (data) => {
    const response = await auth.register(data);
    return response.data;
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setAccessToken(null);
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
