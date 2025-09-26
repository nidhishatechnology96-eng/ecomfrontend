
import React, { useContext } from "react"; // 👈 REMOVED useState and useMemo
import { Link, useNavigate, useLocation } from "react-router-dom"; // 👈 ADDED useNavigate and useLocation
import Footer from "./Footer";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // 👈 --- ADDED THIS LINE

function CartCheckout() {
  const { cart, incrementQty, decrementQty, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext); // 👈 --- ADDED THIS LINE
  const navigate = useNavigate(); // 👈 --- ADDED THIS LINE

  const subtotal = cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // 👇 --- THIS IS THE CORE LOGIC ---
  const handleProceedToCheckout = () => {
    if (currentUser) {
      // If user is logged in, proceed to the checkout flow
      navigate('/checkoutflow');
    } else {
      // If not logged in, redirect to login page,
      // but also tell it where to redirect back to after a successful login.
      navigate('/login', { state: { from: '/checkoutflow' } });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <div className="container my-5 py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <i className="bi bi-cart-x display-1 text-muted"></i>
              <h2 className="mt-3">Your cart is empty</h2>
              <p className="text-muted">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // 🗑️ The `if (checkout)` block was removed as we are now navigating to a new route.

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-5">
        <h2 className="mb-4">Your Shopping Cart</h2>
        <div className="row">
          {/* Cart Table (No changes here) */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                {/* ... table content remains the same ... */}
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light d-none d-md-table-header-group">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => (
                        <tr key={idx} className="d-block d-md-table-row mb-3 border-bottom">
                          <td className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded"
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                            <div className="ms-3">
                              <h6 className="mb-0 text-truncate" style={{ maxWidth: "120px" }}>
                                {item.name}
                              </h6>
                              <small className="d-md-none text-muted">₹{item.price.toFixed(2)}</small>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">₹{item.price.toFixed(2)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => decrementQty(item.id)}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.quantity || 1}
                                onChange={(e) =>
                                  updateQty(item.id, parseInt(e.target.value) || 1)
                                }
                                className="form-control form-control-sm text-center mx-2"
                                style={{ width: "50px" }}
                              />
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => incrementQty(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">
                            ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-outline-danger" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>₹{subtotal.toFixed(2)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%):</span>
                  <strong>₹{tax.toFixed(2)}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Total:</span>
                  <strong>₹{total.toFixed(2)}</strong>
                </div>
                {/* 👇 --- UPDATED THIS BUTTON --- */}
                <button
                  className="btn btn-primary w-100"
                  onClick={handleProceedToCheckout} // 👈 Use the new handler
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default CartCheckout;