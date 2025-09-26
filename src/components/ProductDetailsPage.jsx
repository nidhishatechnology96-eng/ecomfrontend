import React, { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../AdminPanel/AdminContext";
import { CartContext } from "../context/CartContext";
import Footer from "./Footer";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(AdminContext);
  
  // --- CHANGE 1: Get removeFromCart to use in Related Products ---
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => String(p.id) === String(id));
  const cartItem = cart.find(item => item.id === product?.id);
  const inCart = cartItem ? cartItem.quantity : 0;

  if (!product) {
    return (
      <div className="container my-5 text-center py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
            <h2 className="mt-3">Product Not Found</h2>
            <p className="text-muted">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/shop" className="btn btn-primary mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: quantity });

    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded shadow';
    toast.innerHTML = `<span>${quantity} "${product.name}" added to cart!</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity: quantity });
    navigate('/cart');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-5">
        <div className="row g-5">
          {/* --- CHANGE 2: Improved responsive image container --- */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="card shadow-sm border-0 rounded-3 w-100" style={{ maxWidth: '450px' }}>
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name}
                className="img-fluid rounded-3"
                style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Product Details (Mostly the same, very well done!) */}
          <div className="col-md-6">
            {product.category && (
              <span className="badge bg-primary mb-2">{product.category}</span>
            )}
            <h1 className="display-5 fw-bold">{product.name}</h1>

            <div className="d-flex align-items-center mb-3">
              <h2 className="text-success me-3 mb-0">₹{product.price}</h2>
              {inCart > 0 && (
                <span className="badge bg-warning text-dark">
                  {inCart} in cart
                </span>
              )}
            </div>

            <p className="text-muted mb-4 lead fs-6">
              {product.description || "No description available."}
            </p>

            <div className="mb-4">
              <h6>Product Details</h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success me-2"></i>100% natural ingredients</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>No added preservatives</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Freshly packed for quality</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Hygienically processed</li>
              </ul>
            </div>

            <div className="row g-3 align-items-center mb-4">
              <div className="col-auto">
                <label htmlFor="quantity" className="col-form-label fw-bold">Quantity:</label>
              </div>
              <div className="col-auto">
                <div className="input-group" style={{ width: '120px' }}>
                  <button className="btn btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input type="number" className="form-control text-center" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" />
                  <button className="btn btn-outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <div className="col-auto">
                <span className="text-muted">Subtotal: ₹{(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="d-grid gap-2 d-sm-flex">
              <button className="btn btn-primary btn-lg flex-fill" onClick={handleAddToCart}>
                <i className="bi bi-cart-plus me-2"></i>Add to Cart
              </button>
              <button className="btn btn-success btn-lg flex-fill" onClick={handleBuyNow}>
                <i className="bi bi-lightning me-2"></i>Buy Now
              </button>
            </div>

            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2"><i className="bi bi-truck me-2"></i>Delivery Info</h6>
              <p className="small mb-0">Free delivery on orders above ₹500. Usually delivered within 2-3 business days.</p>
            </div>
          </div>
        </div>

        {/* --- CHANGE 3: Logic for Related Products section --- */}
        {products.filter(p => p.category === product.category && p.id !== product.id).length > 0 && (
          <div className="mt-5 pt-5">
            <h3 className="mb-4">Related Products</h3>
            <div className="row g-4">
              {products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 4)
                .map(relatedProduct => {
                  // Check if this specific related product is in the cart
                  const isInCart = cart.some(item => item.id === relatedProduct.id);

                  return (
                    <div key={relatedProduct.id} className="col-md-3 col-6">
                      <div className="card h-100 shadow-sm">
                        <Link to={`/product/${relatedProduct.id}`}>
                          <img
                            src={relatedProduct.image || "https://via.placeholder.com/300"}
                            alt={relatedProduct.name}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        </Link>
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title">{relatedProduct.name}</h6>
                          <p className="card-text text-primary fw-bold mt-auto">₹{relatedProduct.price}</p>
                          
                          {/* Conditionally render "Add" or "Remove" button */}
                          <div className="d-grid mt-2">
                            {isInCart ? (
                              <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(relatedProduct.id)}>
                                <i className="bi bi-trash me-1"></i> Remove
                              </button>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => addToCart(relatedProduct)}>
                            Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default ProductDetails;