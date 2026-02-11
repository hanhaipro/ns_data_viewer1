import { api } from '../utils/api.util.js';

export const orderRequest = {
  list: async (params) => {
    const { data } = await api.get(`/orders`, { params });
    return data;
  },
  total: async (params) => {
    const { data } = await api.get(`/orders/total`, { params });
    return data;
  },
};
