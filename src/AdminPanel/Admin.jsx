
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import ProductManagement from "./ProductManagement";
import OrdersManagement from "./OrdersManagement";
import CategoryManagement from "./CategoryManagement";
import UserManagement from "./UserManagement";
import Reports from "./Reports";

// ✅ DELETED THIS LINE. It was causing the error.
// import { AdminProvider } from "./AdminContext"; 

function Admin() {
  return (
    // The AdminProvider wrapper was correctly removed from here in the last step.
    // Now we've also removed the import for it.
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default Admin;