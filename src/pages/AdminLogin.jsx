import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { adminLogin } = useAuth(); 

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    adminLogin(values.email, values.password)
      .then(() => {
        alert("Admin login successful!");
        navigate("/admin/dashboard");
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid admin credentials");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Admin Heading */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Admin Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter admin email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold 
            hover:bg-gray-800 transition"
          >
            Login as Admin
          </button>
        </form>

      </div>
    </div>
  );
}
