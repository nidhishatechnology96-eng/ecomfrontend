import React, { useContext } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AdminContext } from './AdminContext'; // Ensure this path is correct

/**
 * A reusable, responsive card for displaying stats.
 * It includes a skeleton loading state.
 */
function ReportStatCard({ title, value, icon, color, isLoading }) {
  if (isLoading) {
    return (
      <div className="col">
        <div className="card h-100 shadow-sm border-start border-4 border-light">
          <div className="card-body d-flex align-items-center">
            <div className="flex-grow-1 placeholder-glow">
              <div className="placeholder col-8 mb-2"></div>
              <div className="placeholder col-5"></div>
            </div>
            <div className="ms-3">
              <i className={`bi ${icon} fs-2 text-muted`}></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col">
      <div className={`card h-100 shadow-sm border-start border-4 border-${color}`}>
        <div className="card-body d-flex align-items-center">
          <div className="flex-grow-1">
            <div className={`text-xs fw-bold text-${color} text-uppercase mb-1`}>{title}</div>
            <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
          </div>
          <div className="ms-3">
            <i className={`bi ${icon} fs-2 text-muted`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The main Reports component.
 * It's fully responsive and handles loading/empty states gracefully.
 */
function Reports() {
  // 1. FETCH REAL DATA from the context.
  const { counts, orders, isLoading } = useContext(AdminContext);

  // 2. PREPARE DATA for display.
  // Safely handle cases where 'orders' might be null or undefined.
  const recentOrders = [...(orders || [])].slice(0, 5);

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* ======================= RESPONSIVE HEADER ======================= */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
        <h1 className="h3 mb-2 mb-sm-0 text-gray-800">Reports & Analytics</h1>
        <button className="btn btn-primary align-self-start align-self-sm-auto">
          <i className="bi bi-download me-2"></i>Export Full Report
        </button>
      </div>

      {/* ======================= RESPONSIVE STAT CARDS ======================= */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
        <ReportStatCard
          isLoading={isLoading}
          title="Total Revenue"
          value={`₹${(counts?.revenue || 0).toLocaleString()}`}
          icon="bi-cash-coin"
          color="success"
        />
        <ReportStatCard
          isLoading={isLoading}
          title="Orders (Completed)"
          value={counts?.ordersCompleted || 0}
          icon="bi-check2-circle"
          color="primary"
        />
        <ReportStatCard
          isLoading={isLoading}
          title="Orders (Pending)"
          value={counts?.ordersPending || 0}
          icon="bi-hourglass-bottom"
          color="warning"
        />
        <ReportStatCard
          isLoading={isLoading}
          title="Total Users"
          value={counts?.users || 0}
          icon="bi-people-fill"
          color="info"
        />
      </div>

      {/* ======================= RESPONSIVE RECENT ORDERS TABLE ======================= */}
      <div className="card shadow-sm">
        <div className="card-header py-3">
          <h6 className="m-0 fw-bold text-primary">Recent Orders</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* 3. DYNAMICALLY RENDER based on state */}
                {isLoading ? (
                  // SKELETON LOADER STATE
                  [...Array(5)].map((_, index) => (
                    <tr key={index} className="placeholder-glow">
                      <td><span className="placeholder col-6"></span></td>
                      <td><span className="placeholder col-8"></span></td>
                      <td><span className="placeholder col-5"></span></td>
                      <td><span className="placeholder col-7"></span></td>
                    </tr>
                  ))
                ) : recentOrders.length > 0 ? (
                  // REAL DATA STATE
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="fw-bold text-nowrap">#{order.id}</td>
                      <td className="text-nowrap">{order.customerName || 'N/A'}</td>
                      <td className="text-nowrap">₹{(order.total || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge fs-6 ${order.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  // EMPTY STATE
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No recent orders to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;