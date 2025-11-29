// src/pages/Signup.jsx
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/register", values); // backend route
      alert(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            style={styles.input}
            required
            minLength={6}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", padding: 40 },
  card: { width: 360, padding: 20, borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  input: { display: "block", width: "100%", margin: "8px 0", padding: "10px", fontSize: 16 },
  btn: { padding: "10px 16px", marginTop: 8, cursor: "pointer" },
  error: { color: "crimson", marginTop: 6 }
};
