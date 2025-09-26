import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { AdminContext } from "../AdminPanel/AdminContext";
import { CartContext } from "../context/CartContext"; // Import CartContext
import "./Home.css";
import { FaCarrot, FaAppleAlt, FaLeaf, FaPepperHot, FaTint } from "react-icons/fa";

// Import your images
import bisImg from "../assets/water.png";
import masaImg from "../assets/spices.jpg";
import VegetablesImg from "../assets/veg.jpg";
import fruitsImg from "../assets/Fruits.jpg";

function Home() {
  const { products, categories } = useContext(AdminContext);
  // ✅ 1. GET THE CART ARRAY AND removeFromCart FUNCTION FROM CONTEXT
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const slides = [
    { img: bisImg, title: "Pure & Clean Water", desc: "High-quality mineral water, delivered fresh to you." },
    { img: VegetablesImg, title: "Farm-Fresh Produce", desc: "Organic and farm-fresh vegetables, harvested daily." },
    { img: masaImg, title: "Authentic Masalas", desc: "Rich flavors and aromatic spices from the best farms." },
    { img: fruitsImg, title: "Seasonal Fruits", desc: "A variety of fresh fruits to satisfy your cravings." },
  ];

  const getProductImage = (product) => {
    return product?.image || "https://via.placeholder.com/300";
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ... (Carousel and Categories sections remain the same) ... */}
      <header>
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
          <div className="carousel-indicators">
            {slides.map((_, idx) => (
              <button key={idx} type="button" data-bs-target="#homeCarousel" data-bs-slide-to={idx} className={idx === 0 ? "active" : ""} aria-current={idx === 0 ? "true" : "false"} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
          <div className="carousel-inner ">
            {slides.map((slide, idx) => (
              <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                <img src={slide.img} className="d-block w-100 carousel-img" alt={slide.title} />
                <div className="carousel-caption">
                  <h1 className="animated-caption-title" style={{ borderRadius: "15px", transition: "0.1s", color: "#ffffffff" }}>{slide.title}</h1>
                  <p className="lead fs-5 animated-caption-desc">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon" aria-hidden="true"></span><span className="visually-hidden">Previous</span></button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next"><span className="carousel-control-next-icon" aria-hidden="true"></span><span className="visually-hidden">Next</span></button>
        </div>
      </header>

      <main className="flex-grow-1">
        <section className="container text-center my-3 py-1">
          <h2 className="display-5 fw-bold mb-4 text-primary">Shop by Category</h2>
          <p className="text-muted mb-5">Find what you're looking for with our curated categories.</p>
          <div className="row g-4 justify-content-center category-list-view">
            {categories?.length > 0 ? (
              categories.slice(0, 6).map((category) => {
                const icons = { "Dehydrated Vegetables": <FaCarrot size={28} />, "Dehydrated Fruits": <FaAppleAlt size={28} />, "Herbal Products": <FaLeaf size={28} />, "Spices": <FaPepperHot size={28} />, "Water Bottles": <FaTint size={28} /> };
                return (
                  <div key={category} className="col-6 col-md-4 col-lg-4 category-item">
                    <Link to="/shop" className="text-decoration-none">
                      <div className="card category-card shadow-sm h-100 border-0" style={{ borderRadius: "15px", transition: "0.3s", backgroundColor: "#9ae6eb60" }}>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                          <div className="mb-2" style={{ color: "#396479ce" }}>{icons[category] || <FaLeaf size={28} />}</div>
                          <h6 className="card-title m-0 fw-bold" style={{ color: "#065e56ff" }}>{category}</h6>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (<p className="text-muted">No categories available.</p>)}
          </div>
        </section>

        {/* ======================= FEATURED PRODUCTS SECTION ======================= */}
        <section className="bg-light py-1">
          <div className="container my-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold m-0">Our Featured Products</h2>
              <p className="text-muted mt-2">Handpicked for you from our finest collection.</p>
            </div>
            <div className="row gx-4 gy-5">
              {products?.length > 0 ? products.slice(0, 4).map((p) => {
                // ✅ 2. CHECK IF THE CURRENT PRODUCT IS IN THE CART
                const isInCart = cart.some(item => item.id === p.id);

                return (
                  <div key={p.id} className="col-6 col-lg-3 col-md-4 col-sm-6">
                    <Link to={`/product/${p.id}`} className="product-card-link">
                      <div className="card product-card h-100 border-0 shadow-sm">
                        <img src={getProductImage(p)} className="card-img-top" alt={p.name} />
                        <div className="card-body p-3 d-flex flex-column">
                          <h5 className="product-name">{p.name}</h5>
                          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                            <p className="product-price">₹{p.price}</p>
                            <div className="product-rating">
                              <i className="bi bi-star-fill text-warning"></i>
                              <span className="text-muted ms-1">4.8</span>
                            </div>
                          </div>

                          {/* ✅ 3. CONDITIONALLY RENDER THE BUTTON */}
                          <div className="mt-2">
                            {isInCart ? (
                              // If in cart, show the "Remove" button
                              <button
                                className="btn btn-outline-danger w-100 add-to-cart-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeFromCart(p.id);
                                }}
                              >
                                Remove
                              </button>
                            ) : (
                              // If not in cart, show the "Add to Cart" button
                              <button
                                className="btn btn-primary w-100 add-to-cart-btn"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(p);
                                }}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }) : <p className="text-muted text-center">No products available.</p>}
            </div>
            <div className="text-center mt-5">
              <Link to="/shop" className="btn btn-lg btn-outline-primary">Explore All Products</Link>
            </div>
          </div>
        </section>

        {/* ... (Why Choose Us section remains the same) ... */}
         <section className="container my-5 py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold m-0">Why Choose Us?</h2>
            <p className="text-muted mt-2">We deliver freshness and quality, right to your doorstep.</p>
          </div>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="glass-box">
                <div className="feature-icon-container bg-success bg-opacity-10 text-success mb-3"><i className="bi bi-patch-check-fill fs-1"></i></div>
                <h4 className="fw-bold">Quality Assured</h4>
                <p className="text-muted">Our products are sourced from the best farms and are rigorously quality-checked.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-box">
                <div className="feature-icon-container bg-primary bg-opacity-10 text-primary mb-3"><i className="bi bi-truck fs-1"></i></div>
                <h4 className="fw-bold">Fast Delivery</h4>
                <p className="text-muted">Get your orders delivered fresh and on time, every single time.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-box">
                <div className="feature-icon-container bg-warning bg-opacity-10 text-warning mb-3"><i className="bi bi-award-fill fs-1"></i></div>
                <h4 className="fw-bold">Organic & Fresh</h4>
                <p className="text-muted">We prioritize organic and naturally grown produce for a healthier you.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

     
    </div>
  );
}

export default Home;