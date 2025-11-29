import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const STATUS_ORDER = ["Pending", "Processing", "Shipped", "Delivered"];

function StatusBadge({ status }) {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "Pending":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>⚪ Pending</span>;
    case "Processing":
      return <span className={`${base} bg-orange-100 text-orange-800`}>🔶 Processing</span>;
    case "Shipped":
      return <span className={`${base} bg-blue-100 text-blue-800`}>🚚 Shipped</span>;
    case "Delivered":
      return <span className={`${base} bg-green-100 text-green-800`}>✅ Delivered</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({}); // {orderId: bool}
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/orders", { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Load orders error:", err);
      alert(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    setUpdating((s) => ({ ...s, [orderId]: true }));
    try {
      await api.put(
        `/api/admin/orders/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating((s) => ({ ...s, [orderId]: false }));
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setDeleting((s) => ({ ...s, [orderId]: true }));
    try {
      await api.delete(`/api/admin/orders/${orderId}`, { withCredentials: true });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (err) {
      console.error("Delete order error:", err);
      alert(err?.response?.data?.message || "Failed to delete order");
    } finally {
      setDeleting((s) => ({ ...s, [orderId]: false }));
    }
  };

  // --------- STATS + FILTERS ---------

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount ?? o.total ?? 0),
    0
  );
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        o._id.toLowerCase().includes(term) ||
        o.userId?.name?.toLowerCase().includes(term) ||
        o.userId?.email?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-sm text-gray-500">
            View, filter, and manage all customer orders.
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">₹{totalRevenue}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-xs text-gray-500">Delivered</p>
          <p className="text-2xl font-bold">{deliveredCount}</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white shadow rounded-lg p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by Order ID, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="All">All Statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={loadOrders}
            className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Total</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Items</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}

              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-800 text-xs md:text-sm">
                    <span className="font-mono">{order._id}</span>
                  </td>

                  <td className="px-4 py-4 text-gray-800 text-xs md:text-sm">
                    <div className="flex flex-col">
                      <span>{order.userId?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500">
                        {order.userId?.email}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-gray-800 text-xs md:text-sm">
                    ₹{order.totalAmount ?? order.total ?? 0}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-4 py-4 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {order.items?.length || 0} item(s)
                      </span>
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {expanded[order._id] ? "Hide" : "View"}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-xs md:text-sm text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* Edit Order (if you have EditOrder route) */}
                      <Link
                        to={`/admin/edit-order/${order._id}`}
                        className="text-blue-600 hover:underline text-xs md:text-sm"
                      >
                        Edit
                      </Link>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updating[order._id]}
                        className="border rounded px-2 py-1 text-xs md:text-sm"
                      >
                        {STATUS_ORDER.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={deleting[order._id]}
                        className="text-red-600 px-2 py-1 text-xs md:text-sm rounded border border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Expanded Rows */}
              {filteredOrders.map(
                (order) =>
                  expanded[order._id] && (
                    <tr key={`${order._id}-details`} className="bg-gray-50">
                      <td colSpan="6" className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Items */}
                          <div className="md:col-span-2">
                            <h4 className="font-semibold mb-2 text-sm">
                              Items
                            </h4>
                            <div className="space-y-3">
                              {order.items?.map((it, idx) => {
                                const prod = it.productId || it.product || {};
                                const imgSrc = prod.image
                                  ? `https://backend-ecommerce-qmzv.onrender.com/uploads/${prod.image}`

                                  : null;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-4 bg-white p-3 rounded shadow-sm"
                                  >
                                    {imgSrc ? (
                                      <img
                                        src={imgSrc}
                                        alt={prod.name || "Product"}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    ) : (
                                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                                        No Image
                                      </div>
                                    )}
                                    <div className="text-xs md:text-sm">
                                      <div className="font-medium">
                                        {prod.name || it.name || "Product"}
                                      </div>
                                      <div className="text-gray-600">
                                        Qty: {it.quantity ?? it.qty ?? 1}
                                      </div>
                                      <div className="text-gray-600">
                                        Price: ₹{prod.price ?? it.price ?? 0}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Shipping & Details */}
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">
                              Shipping & Details
                            </h4>
                            <div className="space-y-1 text-xs md:text-sm text-gray-700">
                              <div>
                                <strong>User:</strong>{" "}
                                {order.userId?.name || order.userId?.email}
                              </div>
                              <div>
                                <strong>Email:</strong>{" "}
                                {order.userId?.email || "N/A"}
                              </div>
                              <div>
                                <strong>Address:</strong>{" "}
                                {order.shippingAddress ||
                                  order.address ||
                                  "N/A"}
                              </div>
                              <div>
                                <strong>Phone:</strong>{" "}
                                {order.phone || "N/A"}
                              </div>
                              <div>
                                <strong>Placed:</strong>{" "}
                                {new Date(
                                  order.createdAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
