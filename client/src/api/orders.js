import api from './axios';

export const ordersAPI = {
  getAll: () => api.get('/orders'),   // admin
  getMy: () => api.get('/orders'),    // user
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`)
};
