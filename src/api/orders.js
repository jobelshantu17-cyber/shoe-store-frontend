import api from "./axios";

export const getMyOrders = () => api.get("/api/orders");
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
