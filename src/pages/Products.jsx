import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    api.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log("Error loading products:", err));
  }, []);

  useEffect(() => {
    let updated = products;

    if (category) {
      updated = updated.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchQuery) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFiltered(updated);
  }, [category, searchQuery, products]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">
        {category
          ? `Category: ${category}`
          : searchQuery
          ? `Search: ${searchQuery}`
          : "All Products"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
