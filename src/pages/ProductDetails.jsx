import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useGlobal } from "../context/GlobalContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useGlobal();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedStock, setSelectedStock] = useState(0);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.log("Error loading product:", err));
  }, [id]);

  const handleSizeSelect = (sizeObj) => {
    setSelectedSize(sizeObj.size);
    setSelectedStock(sizeObj.stock);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (selectedStock <= 0) {
      alert("This size is out of stock.");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      maxStock: selectedStock
    });

    alert("Added to cart!");
  };

  if (!product) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <img
          src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${product.image}`}

          alt={product.name}
          className="w-full h-96 object-cover rounded-xl shadow"
        />

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.category}</p>

          <p className="text-3xl font-bold mt-4">₹{product.price}</p>

          <p className="mt-4 text-gray-700">{product.description}</p>

          {/* SIZE SELECTOR */}
          <h3 className="font-semibold text-lg mt-6 mb-2">Select Size</h3>

          <div className="flex gap-3 flex-wrap">
            {product.sizes.map((s, index) => (
              <button
                key={index}
                disabled={s.stock <= 0}
                onClick={() => handleSizeSelect(s)}
                className={`px-4 py-2 rounded-lg border font-semibold 
                  ${selectedSize === s.size ? "bg-black text-white" : "bg-white"} 
                  ${s.stock <= 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}
                `}
              >
                {s.size}
              </button>
            ))}
          </div>

          {/* STOCK DISPLAY */}
          {selectedSize && (
            <p className="mt-2 text-sm">
              Stock for size <b>{selectedSize}</b>:{" "}
              <span className="font-semibold">
                {selectedStock > 0 ? selectedStock : "Out of Stock"}
              </span>
            </p>
          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
