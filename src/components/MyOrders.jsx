import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../AdminPanel/AdminContext"; 
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { fetchOrdersForUser } = useContext(AdminContext);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const getOrders = async () => {
            // Ensure we have a logged-in user before trying to fetch
            if (!currentUser) {
                console.log("MyOrders: No current user found. Cannot fetch orders.");
                setLoading(false);
                return;
            }

            setLoading(true);
            console.log(`MyOrders: Fetching orders for user ID: ${currentUser.uid}`);
            try {
                const userOrders = await fetchOrdersForUser(currentUser.uid);
                console.log("MyOrders: Successfully fetched orders:", userOrders);
                setOrders(userOrders);
            } catch (error) {
                console.error("MyOrders: CRITICAL - Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [currentUser, fetchOrdersForUser]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-success';
            case 'Pending': return 'bg-warning text-dark';
            case 'Shipped': return 'bg-info text-dark';
            default: return 'bg-secondary';
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading orders...</span>
                </div>
                <h5 className="mt-3">Loading Your Orders...</h5>
            </div>
        );
    }

    return (
        <div className="container my-5" style={{ minHeight: '60vh' }}>
            <h2 className="mb-4">My Orders</h2>
            {orders.length === 0 ? (
                <div className="text-center p-5 border rounded bg-light">
                    <i className="bi bi-box-seam" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <h4 className="mt-3">You haven't placed any orders yet.</h4>
                    <p className="text-muted">All your future orders will appear here.</p>
                    <Link to="/shop" className="btn btn-primary mt-3">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map(order => (
                        <div key={order.id} className="card shadow-sm">
                            <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center gap-2 p-3">
                                <div>
                                    <h6 className="mb-0">Order ID: #{order.id.slice(-6).toUpperCase()}</h6>
                                    <small className="text-muted">
                                        Placed on: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className="text-end">
                                    <span className={`badge fs-6 ${getStatusBadgeClass(order.status)}`}>
                                        {order.status || 'Processing'}
                                    </span>
                                    <div className="fs-5 mt-1"><strong>Total: ₹{order.totalAmount.toFixed(2)}</strong></div>
                                </div>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title">Items Ordered</h6>
                                <ul className="list-group list-group-flush">
                                    {order.cart.map(item => (
                                        <li key={item.id} className="list-group-item d-flex justify-content-between px-0">
                                            <span>{item.name} (x{item.quantity})</span>
                                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;