
import React from 'react';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation({ orderDetails }) {
    const navigate = useNavigate();

    // Navigate the user back to the shop to place another order
    const handlePlaceAnotherOrder = () => {
        navigate('/shop');
    };

    // A loading state in case the orderDetails prop isn't ready yet
    if (!orderDetails) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Confirmation...</span>
                </div>
            </div>
        );
    }

    // Destructure all the details from the prop
    const { address, paymentMethod, cart, totalAmount } = orderDetails;

    const successMessage = paymentMethod === 'Cash on Delivery'
        ? 'Your order has been placed successfully! It will be delivered soon.'
        : `Payment successful! Your order is confirmed.`;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="text-center mb-4">
                <i className="bi bi-check-circle-fill display-1 text-success"></i>
                <h2 className="mt-3">Thank You For Your Order!</h2>
                <p className="lead text-muted">{successMessage}</p>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light py-3">
                    <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body p-4">
                    {/* --- THIS IS THE NEW SECTION FOR ORDER ITEMS --- */}
                    <h6 className="text-muted mb-3">Order Items</h6>
                    <ul className="list-group list-group-flush mb-4">
                        {cart.map((item) => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-muted">Quantity: {item.quantity}</small>
                                </div>
                                <span className="text-muted">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    {/* --- END OF NEW SECTION --- */}

                    <hr />

                    <div className="row mt-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h6 className="text-muted">Shipping Address</h6>
                            <p className="mb-1">{address.street}</p>
                            <p className="mb-1">{`${address.city}, ${address.state} ${address.zip}`}</p>
                            <p className="mb-0">{address.country}</p>
                        </div>
                        <div className="col-md-6">
                            <h6 className="text-muted">Payment Method</h6>
                            <p className="mb-0">{paymentMethod}</p>
                            {paymentMethod === 'Cash on Delivery' && (
                                <small className="text-muted">Payment to be collected upon delivery.</small>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-light d-flex justify-content-between align-items-center py-3">
                    <span className="h5 mb-0">Total Amount:</span>
                    <span className="h5 mb-0"><strong>₹{totalAmount.toFixed(2)}</strong></span>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceAnotherOrder}
                >
                    <i className="bi bi-arrow-left me-2"></i>Place Another Order
                </button>
            </div>
        </div>
    );
}

export default OrderConfirmation;