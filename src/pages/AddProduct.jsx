import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    sku: "",
    description: "",
  });

  const [sizes, setSizes] = useState([
    { size: "", stock: "" }
  ]);

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category Load Error:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle size change
  const handleSizeChange = (index, key, value) => {
    const newSizes = [...sizes];
    newSizes[index][key] = value;
    setSizes(newSizes);
  };

  // Add new size row
  const addSizeRow = () => {
    setSizes([...sizes, { size: "", stock: "" }]);
  };

  // Remove size row
  const removeSizeRow = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const submit = (e) => {
    e.preventDefault();

    // Convert sizes to valid number types
    const cleanedSizes = sizes.map((s) => ({
      size: s.size,
      stock: Number(s.stock || 0),
    }));

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append("sizes", JSON.stringify(cleanedSizes));

    if (image) formData.append("image", image);

    api
      .post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Product added successfully!");

        // Reset form
        setForm({
          name: "",
          price: "",
          category: "",
          description: "",
          sku: "",
        });

        setSizes([{ size: "", stock: "" }]);
        setImage(null);
      })
      .catch((err) => {
        console.error("Add Product ERROR:", err);
        alert(err?.response?.data?.message || "Failed to add product");
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-5">Add Product</h2>

      <form onSubmit={submit} className="space-y-4">

        {/* Product Name */}
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
          placeholder="SKU (optional)"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          placeholder="Product Description"
          rows="3"
          required
        />

        {/* SIZES SECTION */}
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-3">Shoe Sizes</h3>

          {sizes.map((sizeObj, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Size (e.g., 7, 8, 9)"
                value={sizeObj.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="border p-2 rounded w-1/2"
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={sizeObj.stock}
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
                  className="px-3 bg-red-500 text-white rounded"
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

        {/* Image Upload */}
        <input
          type="file"
          onChange={handleImage}
          className="border p-3 w-full rounded"
          required
        />

        <button
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          type="submit"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
