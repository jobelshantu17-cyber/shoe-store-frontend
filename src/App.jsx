import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminLogin from "./pages/AdminLogin";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";


// ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminCategories from "./pages/AdminCategories";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";

import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import EditOrder from "./pages/EditOrder";

import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";



// Admin Layout
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />



        {/* PROTECTED USER ROUTE */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* ===========================
            ADMIN ROUTES WITH LAYOUT
        ============================ */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="edit-order/:id" element={<EditOrder />} />


          {/* CATEGORY ROUTES */}
          <Route path="categories" element={<AdminCategories />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:id" element={<EditCategory />} />

        </Route>

      </Routes>

      <Footer />
    </>
  );
}
