import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    api
      .delete(`/api/products/${id}`)
      .then(() => {
        alert("Product deleted");
        setProducts(products.filter((p) => p._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Products</h2>

        <Link
          to="/admin/add-product"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">SKU</th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">

                {/* IMAGE */}
                <td className="p-3">
                  {p.image ? (
                    <img
                      src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${p.image}`}

                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>

                {/* NAME */}
                <td className="p-3 font-medium text-gray-800">{p.name}</td>

                {/* PRICE */}
                <td className="p-3 text-gray-700">₹{p.price}</td>

                {/* CATEGORY */}
                <td className="p-3 text-gray-700">{p.category || "No category"}</td>

                {/* STOCK */}
                <td className="p-3 text-gray-700">{p.stock ?? "—"}</td>

                {/* SKU */}
                <td className="p-3 text-gray-700">{p.sku || "—"}</td>

                {/* ACTION BUTTONS */}
                <td className="p-3 text-center flex gap-3 justify-center">

                  <Link
                    to={`/admin/edit-product/${p._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
