import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <h2 className="text-2xl font-bold p-6 border-b border-gray-700">
          Admin Panel
        </h2>

        <nav className="flex-1 p-4 space-y-4">
          <Link to="/admin/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
          <Link to="/admin/users" className="block hover:text-yellow-400">Users</Link>
          <Link to="/admin/orders" className="block hover:text-yellow-400">Orders</Link>
          <Link to="/admin/products" className="block hover:text-yellow-400">Products</Link>
          <Link to="/admin/add-product" className="block hover:text-yellow-400">Add Product</Link>
          <Link to="/admin/categories" className="block hover:text-yellow-400">Categories</Link>
          <Link to="/admin/add-category" className="block hover:text-yellow-400">Add Category</Link>
          <Link to="/admin/users" className="block hover:text-yellow-400">Manage Users</Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
      
    </div>
  );
}
