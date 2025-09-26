// AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Make sure to install bootstrap-icons
import './admin.css'; // We'll create this file next

function AdminLayout() {
  const navItems = [
    { path: '/admin/dashboard', icon: 'bi-speedometer2', name: 'Dashboard' },
    { path: '/admin/products', icon: 'bi-box-seam', name: 'Products' },
    { path: '/admin/orders', icon: 'bi-cart3', name: 'Orders' },
    { path: '/admin/categories', icon: 'bi-tags', name: 'Categories' },
    { path: '/admin/users', icon: 'bi-people', name: 'Users' },
    { path: '/admin/reports', icon: 'bi-clipboard-data', name: 'Reports' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar - Offcanvas for mobile, fixed for desktop */}
      <div className="offcanvas-lg offcanvas-start admin-sidebar" tabIndex="-1" id="adminSidebar">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold">HYJAIN Admin</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#adminSidebar" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            {navItems.map(item => (
              <NavLink key={item.name} to={item.path} className="nav-link">
                <i className={`bi ${item.icon} me-2`}></i>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content">
        {/* Header */}
        <header className="admin-header">
          <div className="d-flex align-items-center">
             {/* Mobile Menu Toggle */}
            <button className="btn btn-light d-lg-none me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#adminSidebar">
              <i className="bi bi-list"></i>
            </button>
            <h4 className="mb-0 d-none d-md-block">Admin Panel</h4>
          </div>
          <div className="d-flex align-items-center">
            <span className="me-3">Welcome, Admin!</span>
            <img src="https://i.pravatar.cc/40" alt="Admin" className="rounded-circle" />
          </div>
        </header>

        {/* This is where the page content will be injected */}
        <main className="container-fluid p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;