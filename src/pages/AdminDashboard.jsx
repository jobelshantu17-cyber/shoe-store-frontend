import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Boxes,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/admin/users").then((res) => setUsers(res.data));
    api.get("/api/admin/orders").then((res) => setOrders(res.data));
    api.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  const revenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6 text-gray-900 tracking-tight">
        Admin Dashboard
      </h1>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* USERS */}
        <div className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl transition group">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
            <Users size={28} className="text-blue-500" />
          </div>
          <p className="text-4xl font-extrabold text-blue-600 mt-3">
            {users.length}
          </p>
        </div>

        {/* ORDERS */}
        <div className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl transition group">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
            <ShoppingCart size={28} className="text-green-500" />
          </div>
          <p className="text-4xl font-extrabold text-green-600 mt-3">
            {orders.length}
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl transition group">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Products</h2>
            <Boxes size={28} className="text-yellow-500" />
          </div>
          <p className="text-4xl font-extrabold text-yellow-600 mt-3">
            {products.length}
          </p>
        </div>

        {/* REVENUE */}
        <div className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl transition group">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
            <IndianRupee size={28} className="text-purple-600" />
          </div>
          <p className="text-4xl font-extrabold text-purple-600 mt-3">
            ₹{revenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-10 bg-white shadow-lg rounded-2xl p-6 border">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-2 text-gray-600">User</th>
                  <th className="py-3 px-2 text-gray-600">Total</th>
                  <th className="py-3 px-2 text-gray-600">Status</th>
                  <th className="py-3 px-2 text-gray-600">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr
                    key={o._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-2">
                      {o.userId?.name || o.userId?.email || "Guest"}
                    </td>
                    <td className="py-3 px-2 font-semibold">
                      ₹{o.totalAmount?.toLocaleString("en-IN") || 0}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link
          to="/admin/products"
          className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl hover:scale-[1.02] transition text-center"
        >
          <h3 className="text-lg font-bold mb-2 text-gray-800">Manage Products</h3>
          <p className="text-gray-600 text-sm">Add, edit, delete products</p>
        </Link>

        <Link
          to="/admin/categories"
          className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl hover:scale-[1.02] transition text-center"
        >
          <h3 className="text-lg font-bold mb-2 text-gray-800">Manage Categories</h3>
          <p className="text-gray-600 text-sm">Add and edit categories</p>
        </Link>

        <Link
          to="/admin/users"
          className="p-6 bg-white shadow-lg rounded-2xl border hover:shadow-xl hover:scale-[1.02] transition text-center"
        >
          <h3 className="text-lg font-bold mb-2 text-gray-800">View Users</h3>
          <p className="text-gray-600 text-sm">List of all registered users</p>
        </Link>

      </div>
    </div>
  );
}
