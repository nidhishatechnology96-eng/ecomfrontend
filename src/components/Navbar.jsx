import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import LOGOH from "../assets/l.png"; // your logo

function Navbar() {
  const { cart } = useContext(CartContext) || { cart: [] };
  const { currentUser, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  // Define navigation links in one place to avoid repetition
  const navLinks = [
    { to: "/", text: "Home", end: true },
    { to: "/shop", text: "Shop" },
    { to: "/about", text: "About" },
    { to: "/contact", text: "Contact" },
  ];

  // Reusable component for user actions dropdown
  const UserActions = () => (
    <div className="nav-item dropdown">
      <button className="btn btn-link nav-link px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i className="bi bi-person-circle fs-4"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        {!currentUser ? (
          <>
            <li><Link className="dropdown-item" to="/login">Login</Link></li>
            <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
          </>
        ) : (
          <>
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
          </>
        )}
      </ul>
    </div>
  );

  return (
    <header className="sticky-top bg-white shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light py-2">
        <div className="container flex-wrap">
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Brand Logo */}
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src={LOGOH} alt="HYJAIN" className="me-2" style={{ height: "40px" }} />
              <span className="fw-bold text-success fs-5">HYJAIN</span>
            </Link>

            {/* --- Desktop Navigation (Hidden on Mobile) --- */}
            <div className="d-none d-lg-flex align-items-center flex-grow-1">
              <form className="d-flex ms-auto me-3" onSubmit={handleSearch} style={{ minWidth: '350px' }}>
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-success" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>

              <ul className="navbar-nav">
                {navLinks.map(link => (
                  <li className="nav-item" key={link.to}>
                    <NavLink className="nav-link" to={link.to} end={link.end}>{link.text}</NavLink>
                  </li>
                ))}
              </ul>

              <div className="vr mx-3"></div>

              <div className="d-flex align-items-center">
                <UserActions />
                <Link to="/cart" className="btn btn-outline-primary rounded-pill d-flex align-items-center px-3 ms-2">
                  <i className="bi bi-cart3 me-2"></i>
                  <span>Cart</span>
                  {cart.length > 0 && <span className="badge bg-danger rounded-pill ms-2">{cart.length}</span>}
                </Link>
              </div>
            </div>

            {/* --- Mobile Actions & Toggler (Hidden on Desktop) --- */}
            <div className="d-flex align-items-center d-lg-none">
              <UserActions />
              <Link to="/cart" className="btn btn-link nav-link position-relative me-2">
                <i className="bi bi-cart3 fs-4"></i>
                {cart.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6em' }}>
                    {cart.length}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
              <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbarCollapse" aria-controls="mainNavbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>

          {/* --- Mobile Search Bar & Collapsible Menu --- */}
          <div className="d-lg-none w-100">
            <div className="pt-2">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-success" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="collapse navbar-collapse" id="mainNavbarCollapse">
              <ul className="navbar-nav mt-3">
                {navLinks.map(link => (
                  <li className="nav-item" key={link.to}>
                    <NavLink className="nav-link" to={link.to} end={link.end}>{link.text}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;