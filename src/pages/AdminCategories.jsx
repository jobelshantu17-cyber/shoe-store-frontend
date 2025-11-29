import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/api/categories")
      .then((res) => {
        setCategories(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("Load categories error:", err);
        setError("Failed to load categories");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category?")) return;
    api
      .delete(`/api/categories/${id}`)
      .then(() => {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.error("Delete category error:", err);
        alert("Failed to delete category");
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link
          to="/admin/add-category"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Category
        </Link>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      <Link
                        to={`/admin/edit-category/${c._id}`}
                        className="text-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
