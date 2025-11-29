import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/admin/users");
      setUsers(res.data);

    } catch (err) {
      setError("Failed to load users");
      console.log("User load error:", err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Toggle user status
  const toggleStatus = async (id) => {
    try {
      await api.put(`/api/admin/users/toggle/${id}`);
      loadUsers(); // reload after update
    } catch (err) {
      console.log("Toggle error:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading users...</h2>;
  if (error) return <h2 className="text-center text-red-600 mt-10">{error}</h2>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">
                {user.isActive ? (
                  <span className="text-green-600 font-bold">Active</span>
                ) : (
                  <span className="text-red-600 font-bold">Inactive</span>
                )}
              </td>
              <td className="p-3 border">
                <button
                  onClick={() => toggleStatus(user._id)}
                  className={`px-4 py-2 rounded text-white ${
                    user.isActive ? "bg-red-500" : "bg-green-600"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
