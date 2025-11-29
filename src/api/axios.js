import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-ecommerce-qmzv.onrender.com",
  withCredentials: true
});

export default api;
