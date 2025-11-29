import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    api
      .get("/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log("Error loading orders:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ============================
  // CANCEL ORDER
  // ============================
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/api/orders/cancel/${orderId}`);
      alert("Order cancelled successfully!");
      loadOrders(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling order");
    }
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;

  if (!orders.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">No Orders Found</h2>
        <Link
          to="/products"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border p-5 rounded-xl shadow bg-white"
          >
            <h3 className="text-lg font-semibold">
              Order ID: {order._id}
            </h3>

            <p className="text-gray-600">Total: ₹{order.totalAmount}</p>

            {/* ORDER STATUS */}
            <p className="mt-1 font-semibold">
              Status:{" "}
              <span
                className={
                  order.status === "Cancelled"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {order.status}
              </span>
            </p>

            <ul className="mt-3">
              {order.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {item.productId.name} — Size: {item.size} — Qty:{" "}
                  {item.quantity}
                </li>
              ))}
            </ul>

            {/* BUTTONS */}
            <div className="mt-4 flex gap-4">
              <Link
                to={`/orders/${order._id}`}
                className="bg-black text-white px-4 py-2 rounded-xl"
              >
                View Details
              </Link>

              {/* CANCEL BUTTON */}
              {order.status !== "Cancelled" ? (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
                >
                  Cancel Order
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 rounded-xl cursor-not-allowed"
                >
                  Cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
