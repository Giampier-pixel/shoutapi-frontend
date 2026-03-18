import api from './axios';

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const refresh = () => api.post('/auth/refresh');
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/users/me'); // Optional based on the backend routes provided, though getting user profile is usually via users routes.
