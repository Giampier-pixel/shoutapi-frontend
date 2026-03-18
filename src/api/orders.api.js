import api from './axios';

export const checkout = () => api.post('/orders/checkout');
export const getMyOrders = (params) => api.get('/orders/my', { params });
export const getMyOrderById = (id) => api.get(`/orders/my/${id}`);
export const getAllOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
