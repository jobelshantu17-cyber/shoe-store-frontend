import { useEffect, useState } from "react";
import hero from "../assets/hero-shoe.jpg";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => setProducts(res.data.slice(0, 4))) // only 4 featured
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="relative px-8 md:px-20 py-20 overflow-hidden">
        
        {/* Background design */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-100 -z-10"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* LEFT TEXT */}
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              Elevate Your Style,<br />
              <span className="text-gray-700">One Step At a Time.</span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Discover footwear engineered for comfort, durability, and design.
              Made for everyday champions.
            </p>

            <Link to="/products">
              <button className="mt-8 px-7 py-3 text-lg font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-all shadow-md hover:shadow-lg">
                Shop Now →
              </button>
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={hero}
              alt="Hero Shoe"
              className="w-80 md:w-[420px] drop-shadow-2xl hover:scale-105 transition-transform duration-300 rounded-xl"
            />
          </div>
          
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-8 md:px-20 py-16 bg-white">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Featured Products
          </h2>

          <Link to="/products">
            <button className="text-lg font-medium border border-gray-800 px-6 py-2 rounded-lg hover:bg-gray-900 hover:text-white transition">
              View All
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
