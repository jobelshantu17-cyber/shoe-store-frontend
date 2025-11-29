import { useGlobal } from "../context/GlobalContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Cart() {
  const { cart, updateQty, removeFromCart, totalPrice, clearCart } = useGlobal();
  const navigate = useNavigate();

  // -----------------------------
  // UPDATE QTY (Backend + Frontend)
  // -----------------------------
  const handleQtyChange = async (item, newQty) => {
    try {
      // Backend update
      await api.put("/api/cart/update", {
        productId: item._id,
        size: item.size,
        quantity: newQty,
      });

      // Frontend update
      updateQty(item._id, item.size, newQty);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  // -----------------------------
  // REMOVE ITEM (Backend + Frontend)
  // -----------------------------
  const handleRemove = async (item) => {
    try {
      await api.post("/api/cart/remove", {
        productId: item._id,
        size: item.size,
      });

      removeFromCart(item._id, item.size);
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  // -----------------------------
  // CLEAR CART
  // -----------------------------
  const handleClearCart = async () => {
    try {
      await api.delete("/api/cart/clear");
      clearCart(); // frontend
    } catch (err) {
      alert("Failed to clear cart");
    }
  };

  if (!cart.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <Link
          to="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {/* Cart Items */}
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={`${item._id}-${item.size}`}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow border"
          >
            {/* Image */}
            <img
             src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${item.image}`}

              alt={item.name}
              className="w-24 h-20 object-cover rounded-md border"
            />

            {/* Product Info */}
            <div className="flex-1 px-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500">₹{item.price}</p>

              {/* Size */}
              <p className="text-sm text-gray-600 font-medium">
                Size: <span className="font-bold">{item.size}</span>
              </p>

              {/* Stock */}
              <p className="text-xs text-gray-400">
                Max Stock: {item.maxStock}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleQtyChange(item, item.qty - 1)}
              >
                -
              </button>

              <span className="px-3 font-semibold">{item.qty}</span>

              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleQtyChange(item, item.qty + 1)}
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => handleRemove(item)}
              className="text-red-500 font-semibold hover:underline ml-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow border">
        <h3 className="text-2xl font-bold">Total: ₹{totalPrice}</h3>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
          >
            Checkout
          </button>

          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
