import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useGlobal } from "./GlobalContext";   // ⭐ IMPORTANT

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Get function from GlobalContext
  const { setCartFromBackend } = useGlobal();

  // ================================
  // RESTORE SESSION ON PAGE REFRESH
  // ================================
  useEffect(() => {
    setLoading(true);

    api.get("/api/auth/me")
      .then((res) => {
        setUser(res.data.user);

        // ⭐ Also load cart if logged in
        api.get("/api/cart")
          .then((cartRes) => setCartFromBackend(cartRes.data))
          .catch(() => {});
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ================================
  // USER LOGIN
  // ================================
  const login = (email, password) => {
    return api.post("/api/auth/login", { email, password })
      .then(async (res) => {
        setUser(res.data.user);

        // ⭐ Load backend cart after login
        try {
          const cartRes = await api.get("/api/cart");
          setCartFromBackend(cartRes.data);
        } catch (err) {
          console.log("No cart found");
        }

        return res.data;
      });
  };

  // ================================
  // ADMIN LOGIN
  // ================================
  const adminLogin = (email, password) => {
    return api.post("/api/auth/admin/login", { email, password })
      .then(async (res) => {
        setUser(res.data.user);

        // ⭐ Admin also loads cart (recommended)
        try {
          const cartRes = await api.get("/api/cart");
          setCartFromBackend(cartRes.data);
        } catch (err) {}

        return res.data;
      });
  };

  // ================================
  // REGISTER
  // ================================
  const register = (name, email, password) => {
    return api.post("/api/auth/register", { name, email, password });
  };

  // ================================
  // LOGOUT
  // ================================
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);

      // ⭐ Clear cart in frontend also
      setCartFromBackend({ items: [] });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      adminLogin,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
