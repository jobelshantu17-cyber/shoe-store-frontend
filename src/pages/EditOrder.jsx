import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/admin/orders/${id}`, { withCredentials: true })
      .then((res) => {
        const o = res.data;
        setOrder({
          status: o.status || "Pending",
          shippingAddress: o.shippingAddress || "",
          phone: o.phone || "",
          items: (o.items || []).map((it) => ({
            productId: it.productId?._id || it.productId,
            name: it.productId?.name || it.name || "Product",
            price: it.productId?.price || it.price || 0,
            quantity: it.quantity ?? 1,
            image: it.productId?.image || it.image || null,
          })),
          user: o.userId || null,
          createdAt: o.createdAt,
        });
      })
      .catch((err) => {
        console.error("Load order error:", err);
        alert("Failed to load order");
        navigate("/admin/orders");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleItemChange = (index, field, value) => {
    setOrder((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const handleRemoveItem = (index) => {
    setOrder((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setOrder((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          name: "New Product",
          price: 0,
          quantity: 1,
          image: null,
        },
      ],
    }));
  };

  const handleFieldChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const total = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
      0
    );
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order) return;

    setSaving(true);

    const payload = {
      status: order.status,
      shippingAddress: order.shippingAddress,
      phone: order.phone,
      items: order.items.map((it) => ({
        productId: it.productId,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      })),
      totalAmount: total,
    };

    api
      .put(`/api/admin/orders/${id}`, payload, { withCredentials: true })
      .then(() => {
        alert("Order updated successfully!");
        navigate("/admin/orders");
      })
      .catch((err) => {
        console.error("Update order error:", err);
        alert(err?.response?.data?.message || "Failed to update order");
      })
      .finally(() => setSaving(false));
  };

  if (loading || !order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-2">Edit Order</h2>

      {/* Order & User Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4 space-y-2">
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="text-sm text-gray-700">
            <div><strong>ID:</strong> {id}</div>
            <div><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={order.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4 space-y-2">
          <h3 className="font-semibold mb-2">Customer</h3>
          <div className="text-sm text-gray-700">
            <div><strong>Name:</strong> {order.user?.name || "N/A"}</div>
            <div><strong>Email:</strong> {order.user?.email || "N/A"}</div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={order.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Phone number"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Shipping Address</label>
            <textarea
              value={order.shippingAddress}
              onChange={(e) => handleFieldChange("shippingAddress", e.target.value)}
              className="border rounded px-3 py-2 w-full"
              rows="3"
              placeholder="Address"
            />
          </div>
        </div>
      </div>

      {/* Items editor */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {order.items.map((it, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-[80px,1fr,100px,100px,80px] gap-3 items-center border rounded p-2"
              >
                {/* Image preview (optional) */}
                <div className="flex justify-center">
                  {it.image ? (
                    <img
                      src={`https://backend-ecommerce-qmzv.onrender.com/uploads/${it.image}`}

                      alt={it.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-500">Product Name</label>
                  <input
                    value={it.name}
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500">Price</label>
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500">Subtotal</div>
                  <div className="text-sm font-medium">
                    ₹{(Number(it.price) || 0) * (Number(it.quantity) || 0)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-xs text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total + Save */}
        <div className="flex justify-between items-center bg-white shadow rounded p-4">
          <div>
            <div className="text-sm text-gray-600">Total Amount</div>
            <div className="text-2xl font-bold">₹{total}</div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
