import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditProduct() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    sku: "",
    description: "",
    image: "",
  });

  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);

  // Load product + categories
  useEffect(() => {
    api.get("/api/categories").then((res) => setCategories(res.data));

    api
      .get(`/api/products/${id}`)
      .then((res) => {
        const data = res.data;

        setForm({
          name: data.name,
          price: data.price,
          category: data.category,
          sku: data.sku,
          description: data.description,
          image: data.image,
        });

        // Load sizes if exist, else add one blank row
        setSizes(data.sizes?.length ? data.sizes : [{ size: "", stock: "" }]);
      })
      .catch((err) => console.log("Fetch Product Error:", err));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setNewImage(e.target.files[0]);

  // Handle size change
  const handleSizeChange = (index, key, value) => {
    const updated = [...sizes];
    updated[index][key] = value;
    setSizes(updated);
  };

  // Add size row
  const addSizeRow = () => {
    setSizes([...sizes, { size: "", stock: "" }]);
  };

  // Remove size row
  const removeSizeRow = (index) => {
    const updated = sizes.filter((_, i) => i !== index);
    setSizes(updated);
  };

  const submit = (e) => {
    e.preventDefault();

    const cleanedSizes = sizes.map((s) => ({
      size: s.size,
      stock: Number(s.stock || 0),
    }));

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key !== "image") formData.append(key, form[key]);
    });

    formData.append("sizes", JSON.stringify(cleanedSizes));

    if (newImage) {
      formData.append("image", newImage);
    }

    api
      .put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => alert("Product updated successfully!"))
      .catch((err) => console.error("Update Error:", err));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-5">Edit Product</h2>

      <form onSubmit={submit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          placeholder="Product Name"
          required
        />

        {/* Price */}
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          placeholder="Price"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 w-full rounded bg-white"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SKU */}
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          placeholder="SKU"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          rows="3"
          placeholder="Description"
          required
        ></textarea>

        {/* SIZES SECTION */}
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-3">Shoe Sizes</h3>

          {sizes.map((s, index) => (
            <div key={index} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                placeholder="Size (e.g., 7, 8)"
                value={s.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="border p-2 rounded w-1/2"
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={s.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                className="border p-2 rounded w-1/2"
                required
              />

              {sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizeRow(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSizeRow}
            className="mt-2 px-4 py-2 bg-black text-white rounded"
          >
            + Add Size
          </button>
        </div>

        {/* Current image */}
        {form.image && (
          <div>
            <p className="font-semibold mb-1">Current Image:</p>
            <img
              src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${form.image}`}

              className="w-32 h-32 object-cover border rounded mb-3"
              alt="Product"
            />
          </div>
        )}

        {/* Upload new image */}
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-3 w-full rounded"
        />

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
