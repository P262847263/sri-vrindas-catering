import api from './api';

const API_URL = '/orders';

export const placeOrder = async (order: any) => {
  try {
    const res = await api.post(API_URL, order);
    return res.data;
  } catch (err: any) {
    console.error('placeOrder failed', err && err.response ? err.response.data : err.message);
    throw err;
  }
};

export const getOrders = async () => {
  const res = await api.get(API_URL);
  return res.data;
};
