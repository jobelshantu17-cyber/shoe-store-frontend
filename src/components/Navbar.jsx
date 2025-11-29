import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function Navbar() {
  const { totalItems } = useGlobal();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // Load categories
  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log("Category load error:", err));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const goToCategory = (name) => {
    navigate(`/products?category=${name}`);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/products?search=${search}`);
      setSearch("");
    }
  };

  return (
    <nav className="w-full bg-black text-white px-6 h-16 flex items-center shadow-lg sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        ShoeStore
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6 ml-10">

        <NavLink to="/" className="hover:text-gray-300">
          Home
        </NavLink>

        {/* Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((p) => !p)}
            className="hover:text-gray-300"
          >
            Categories ▾
          </button>

          {showDropdown && (
            <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
              {categories.length === 0 ? (
                <div className="p-3 text-gray-600">No Categories</div>
              ) : (
                categories.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => goToCategory(c.name)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white"
                  >
                    {c.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <NavLink to="/products" className="hover:text-gray-300">
          Products
        </NavLink>

        <NavLink to="/contact" className="hover:text-gray-300">
          Contact
        </NavLink>

        {/* ⭐ My Orders link only for logged-in users */}
        {user && (
          <NavLink to="/my-orders" className="hover:text-gray-300">
            My Orders
          </NavLink>
        )}

      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search shoes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="ml-auto w-64 px-3 py-1 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Cart */}
      <Link to="/cart" className="ml-6 relative text-xl">
        🛒
        <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-2 py-[2px] text-xs">
          {totalItems}
        </span>
      </Link>

      {/* Auth */}
      <div className="flex items-center gap-4 ml-6">
        {user ? (
          <>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="hover:text-gray-300">
              Login
            </NavLink>
            <NavLink to="/signup" className="hover:text-gray-300">
              Signup
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
