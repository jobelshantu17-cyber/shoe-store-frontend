import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(values.email, values.password);

      alert("Login successful");

      // ⭐ Small delay so cart sync can complete before page reload
      setTimeout(() => {
        window.location.href = "/";
      }, 300);

    } catch (err) {
      alert("Admin Denied Access!!!!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Login to Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold 
            hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {/* Additional Links */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-black font-semibold hover:underline">
            Register here
          </a>
        </p>

      </div>
    </div>
  );
}
