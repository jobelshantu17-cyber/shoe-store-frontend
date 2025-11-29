import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import api from "../api/axios";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart]);

  const placeOrder = () => {
    // ✅ FIXED URL
    api.post("/api/orders")
      .then(res => {
        clearCart();
        navigate(`/order-success?id=${res.data.order._id}`);
      })
      .catch(err => {
        console.error("Checkout Error:", err);
        alert(err.response?.data?.message || "Something went wrong!");
      });
  };

  return (
    <div className="max-w-2xl mx-auto text-center mt-20">
      <h1 className="text-3xl font-bold">Confirm Order</h1>

      <p className="text-lg mt-4">
        Total Amount: <span className="font-bold">₹{totalPrice}</span>
      </p>

      <button
        onClick={placeOrder}
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
}
