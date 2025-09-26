import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      {/* Add other admin routes here */}
    </Routes>
  );
}

export default AdminRoutes;