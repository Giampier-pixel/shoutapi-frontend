import React from 'react';

const statusConfig = {
  pending: { label: 'Pendiente', classes: 'bg-amber-100 text-amber-800' },
  processing: { label: 'Procesando', classes: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Enviado', classes: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Entregado', classes: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-800' },
};

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, classes: 'bg-slate-100 text-slate-800' };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
