import axios from "axios";

const API_BASE = "https://restaurant-backend.onrender.com";

export const fetchMenu = async () => {
  const res = await axios.get(`${API_BASE}/api/menu`);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await axios.get(`${API_BASE}/api/orders`);
  return res.data;
};

export const placeOrder = async (orderForm) => {
  await axios.post(`${API_BASE}/api/orders`, orderForm);
};

export const submitFeedback = async (feedbackForm) => {
  await axios.post(`${API_BASE}/api/feedback`, feedbackForm);
};
