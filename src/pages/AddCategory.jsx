import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name required");
    setLoading(true);
    try {
      await api.post("/api/categories", { name });
      alert("Category added!");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Add category error:", err);
      alert(err?.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Category name (e.g., Sports)"
          required
        />

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
