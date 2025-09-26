import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { AdminContext } from "../AdminPanel/AdminContext";
import { CartContext } from "../context/CartContext";

const Shop = () => {
  const { products = [], categories = [], isLoading } = useContext(AdminContext);
  
  // --- CHANGE 1: Get the full cart and removeFromCart function ---
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("name-asc");

  // Filtering and sorting logic remains the same
  const filteredProducts = products
    .filter(p =>
      (p?.name?.toLowerCase() || "").includes(search.toLowerCase()) &&
      (category === "All" || p.category === category) &&
      p.price >= price[0] && p.price <= price[1]
    )
    .sort((a, b) => {
        switch (sortBy) {
            case "name-asc": return (a.name || "").localeCompare(b.name || "");
            case "name-desc": return (b.name || "").localeCompare(a.name || "");
            case "price-asc": return (a.price || 0) - (b.price || 0);
            case "price-desc": return (b.price || 0) - (a.price || 0);
            default: return 0;
        }
    });

  if (isLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
        <h4 className="mt-3">Loading Products...</h4>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        Our Products ({filteredProducts.length} found)
      </h2>
      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            // --- CHANGE 2: For each product, check if it's already in the cart ---
            const isInCart = cart.some(item => item.id === product.id);

            return (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                  <Link to={`/product/${product.id}`} className="text-decoration-none">
                    <div style={{ height: "200px", width: "100%", backgroundColor: "#f8f9fa" }}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        style={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    </div>
                  
                    <div className="card-body d-flex flex-column p-3">
                      <h5 className="card-title fs-6 text-dark">{product.name}</h5>
                      <p className="text-muted small mb-2">{product.category}</p>
                      <h6 className="text-primary fw-bold mb-3">₹{product.price}</h6>
                      <p className="card-text small flex-grow-1 text-muted">
                        {product.description?.substring(0, 80)}...
                      </p>
                      <div className="mt-auto d-grid gap-2">
                        {/* --- CHANGE 3: Conditionally render the "Add" or "Remove" button --- */}
                        {isInCart ? (
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={(e) => {
                              // Prevent the Link's navigation when clicking the button
                              e.preventDefault(); 
                              removeFromCart(product.id);
                            }}
                          >
                            <i className="bi bi-trash me-1"></i> Remove
                          </button>
                        ) : (
                          <button 
                            className="btn btn-primary" 
                            onClick={(e) => {
                              // Prevent the Link's navigation when clicking the button
                              e.preventDefault();
                              addToCart(product);
                            }}
                          >
                          Add to Cart
                          </button>
                        )}
                       
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5">
            <h4 className="text-muted">No products found</h4>
            <p className="text-muted">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;