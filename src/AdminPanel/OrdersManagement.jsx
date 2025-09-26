import React, { useContext, useState, useMemo } from 'react';
import { AdminContext } from './AdminContext';
import 'bootstrap-icons/font/bootstrap-icons.css';

// A new component for the Order Details Modal
function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Details: #{order.id.slice(-6).toUpperCase()}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Customer & Status</h6>
                <p className="mb-1"><strong>Email:</strong> {order.userEmail}</p>
                <p><strong>Status:</strong> <span className="badge bg-primary">{order.status}</span></p>
              </div>
              <div className="col-md-6">
                <h6>Shipping Address</h6>
                <p className="mb-1">{order.address.street}</p>
                <p className="mb-1">{order.address.city}, {order.address.state} - {order.address.zip}</p>
                <p>{order.address.country}</p>
              </div>
            </div>
            <hr />
            <h6>Order Items</h6>
            <ul className="list-group list-group-flush">
              {order.cart.map(item => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer d-flex justify-content-between">
              <h5 className="mb-0">Total: ₹{order.totalAmount.toFixed(2)}</h5>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}


function OrdersManagement() {
  const { orders, isLoading, updateOrderStatus } = useContext(AdminContext);
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(o =>
      (o.userEmail && o.userEmail.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q))
    );
  }, [orders, query]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success';
      case 'Pending': return 'bg-warning text-dark';
      case 'Shipped': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

  if (isLoading) {
    return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4">
          <h1 className="h3 mb-2 mb-sm-0 text-gray-800">Orders Management</h1>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by email, status, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0 responsive-card-table">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td data-label="Order ID" className="fw-bold">#{order.id.slice(-6).toUpperCase()}</td>
                      <td data-label="Customer">{order.userEmail}</td>
                      <td data-label="Total Amount">₹{order.totalAmount.toFixed(2)}</td>
                      <td data-label="Date">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</td>
                      <td data-label="Status">
                        <span className={`badge fs-6 ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td data-label="Action" className="text-center">
                         <div className="btn-group">
                           <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedOrder(order)}>
                             <i className="bi bi-eye-fill me-1"></i>View
                           </button>
                           <button type="button" className="btn btn-sm btn-outline-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                             <span className="visually-hidden">Toggle Dropdown</span>
                           </button>
                           <ul className="dropdown-menu">
                             <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Pending')}>Set as Pending</button></li>
                             <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Shipped')}>Set as Shipped</button></li>
                             <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Set as Delivered</button></li>
                           </ul>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-muted">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Render the modal component when an order is selected */}
      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}

export default OrdersManagement;