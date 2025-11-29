import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/categories/${id}`)
      .then((res) => {
        setName(res.data.name || "");
      })
      .catch((err) => {
        console.error("Fetch category error:", err);
        alert("Failed to load category");
        navigate("/admin/categories");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name required");
    setSaving(true);
    try {
      await api.put(`/api/categories/${id}`, { name });
      alert("Category updated!");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Update category error:", err);
      alert(err?.response?.data?.message || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Category name"
          required
        />

        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
