
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AdminContext } from './AdminContext'; // Ensure this is imported correctly

// The StatCard component is fine, no changes needed here.
function StatCard({ title, value, icon, color, link, desc }) {
  return (
    <div className="col">
      <div className={`card h-100 shadow-sm border-start border-4 border-${color}`}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col">
              <div className={`text-xs fw-bold text-${color} text-uppercase mb-1`}>{title}</div>
              <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
              <small className="text-muted">{desc}</small>
            </div>
            <div className="col-auto">
              <i className={`bi ${icon} fs-2 text-gray-300`}></i>
            </div>
          </div>
          <Link to={link} className="stretched-link"></Link>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  // ✅ 1. GET THE LIVE `products` ARRAY FROM THE CONTEXT
  // We can also get users and orders here if they were available in the context.
  const { products } = useContext(AdminContext);

  // ✅ 2. CALCULATE THE VALUES DIRECTLY FROM THE LIVE DATA
  //    - `products.length` gives the total number of products.
  //    - For now, other values are placeholders until you add orders and users to the context.
  const productCount = products.length;
  const totalRevenue = 0; // Placeholder
  const pendingOrders = 0; // Placeholder
  const userCount = 0; // Placeholder

  const cardData = [
    { title: 'Products', value: productCount, icon: 'bi-box-seam', color: 'primary', link: '/admin/products', desc: 'Total products' },
    { title: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: 'bi-currency-rupee', color: 'success', link: '/admin/reports', desc: 'Total earnings' },
    { title: 'Pending Orders', value: pendingOrders, icon: 'bi-hourglass-split', color: 'warning', link: '/admin/orders', desc: 'Awaiting action' },
    { title: 'Users', value: userCount, icon: 'bi-people', color: 'info', link: '/admin/users', desc: 'Registered users' },
  ];

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i className="bi bi-download me-2"></i>Generate Report
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
        {cardData.map(card => <StatCard key={card.title} {...card} />)}
      </div>
    </>
  );
}

export default Dashboard;