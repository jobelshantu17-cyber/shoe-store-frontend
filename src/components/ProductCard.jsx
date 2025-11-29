import { useState } from "react";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import api from "../api/axios";

export default function ProductCard({ product }) {
  const { addToCart } = useGlobal();
  const [selectedSize, setSelectedSize] = useState("");

  // ------------------------------
  // STOCK CALCULATION
  // ------------------------------
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  const sizeStock = hasSizes
    ? product.sizes.reduce((sum, s) => sum + Number(s.stock || 0), 0)
    : 0;

  const totalStock = hasSizes ? sizeStock : Number(product.stock || 0);

  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  // ------------------------------
  // ADD TO CART (BACKEND + FRONTEND)
  // ------------------------------
  const handleAdd = async () => {
    if (hasSizes && !selectedSize) {
      alert("Please select a size");
      return;
    }

    const sizeObj = hasSizes
      ? product.sizes.find((s) => s.size === selectedSize)
      : null;

    try {
      // 1️⃣ SEND TO BACKEND
      await api.post("/api/cart/add", {
        productId: product._id,
        size: selectedSize,
        quantity: 1,
      });

      // 2️⃣ UPDATE FRONTEND CART
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: hasSizes ? selectedSize : null,
        maxStock: hasSizes ? sizeObj.stock : totalStock,
      });

      alert("Added to cart");

    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="relative bg-white border rounded-2xl p-5 shadow-md hover:shadow-xl transition transform hover:-translate-y-1">

      {/* BADGES */}
      {isOutOfStock && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
          Out of Stock
        </span>
      )}

      {isLowStock && !isOutOfStock && (
        <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
          Low Stock ({totalStock})
        </span>
      )}

      {/* IMAGE */}
      <Link to={`/product/${product._id}`}>
        <img
          src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${product.image}`}

          alt={product.name}
          className={`w-full h-48 object-cover rounded-xl transition ${
            isOutOfStock ? "opacity-50" : ""
          }`}
        />
      </Link>

      {/* CONTENT */}
      <div className="mt-4">
        <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.category}</p>

        <p className="text-2xl font-bold mt-3">₹{product.price}</p>

        <p className="mt-2 text-sm font-semibold">
          {isOutOfStock ? (
            <span className="text-red-600">Out of Stock</span>
          ) : isLowStock ? (
            <span className="text-yellow-600">Only {totalStock} left</span>
          ) : (
            <span className="text-green-600">In Stock</span>
          )}
        </p>

        {/* SIZE SELECTOR */}
        {hasSizes && !isOutOfStock && (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-3 w-full border p-2 rounded-lg"
          >
            <option value="">Select Size</option>
            {product.sizes.map((s, i) => (
              <option key={i} value={s.size} disabled={s.stock <= 0}>
                {s.size} {s.stock <= 0 && "(Out of Stock)"}
              </option>
            ))}
          </select>
        )}

        {/* ADD TO CART */}
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2 rounded-xl font-semibold transition text-white ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
