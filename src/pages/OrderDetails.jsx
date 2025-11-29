import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const loadOrder = () => {
    api.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (!order) return <p className="p-6 text-center">Loading...</p>;

  const cancelOrder = () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    api.put(`/api/orders/cancel/${order._id}`)
      .then(() => {
        alert("Order cancelled");
        loadOrder();
      })
      .catch(err => alert(err.response?.data?.message || "Cancel failed"));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Order Details</h2>

      <div className="border p-5 rounded-xl bg-white shadow">
        <p className="text-lg font-semibold">
          Order ID: {order._id}
        </p>

        <p className="text-gray-600 mt-1">
          Total: ₹{order.totalAmount}
        </p>

        <p className="mt-2 font-semibold">
          Status:
          <span
            className={
              order.status === "Cancelled"
                ? "text-red-600 ml-2"
                : "text-green-600 ml-2"
            }
          >
            {order.status}
          </span>
        </p>

        <h3 className="text-xl font-bold mt-5 mb-2">Items</h3>

        {order.items.map((item, i) => (
          <div key={i} className="border-b py-3">
            <p className="font-semibold">{item.productId.name}</p>
            <p className="text-sm text-gray-500">
              Size: {item.size} — Qty: {item.quantity}
            </p>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/my-orders"
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Back to Orders
          </Link>

          {order.status !== "Cancelled" ? (
            <button
              onClick={cancelOrder}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
            >
              Cancel Order
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-xl cursor-not-allowed"
            >
              Cancelled
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
