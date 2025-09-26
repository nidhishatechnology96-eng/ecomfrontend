import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"; // Your custom app styles

// --- PROVIDERS ---
// Import providers to wrap the entire application and provide global state.
import AuthProvider from "./context/AuthContext"; 
import AdminProvider from "./AdminPanel/AdminContext";
import { CartProvider } from "./context/CartContext";

// --- LAYOUT COMPONENTS ---
// These components, like Navbar and Footer, will be present on most pages.
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- PAGES & COMPONENTS ---
// Import all the pages that will be used in the routes.
import Home from "./components/Home";
import Shop from "./components/Shop";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import CartCheckout from "./components/CartCheckout";
import ProductDetails from "./components/ProductDetailsPage";
import SearchResultsPage from "./components/SearchResultsPage";
import CheckoutFlow from "./components/CheckoutFlow";
import MyOrders from "./components/MyOrders";

// --- AUTHENTICATION PAGES ---
import LoginPage from "./Authentication/LoginPage";
import SignupPage from "./Authentication/SignupPage";
import ForgotPassword from "./Authentication/ForgotPassword";
import UserProfile from "./Authentication/UserProfile";

// --- ADMIN PANEL ---
import Admin from "./AdminPanel/Admin";
import ProtectedRoute from "./AdminPanel/ProtectedRoute"; 

/**
 * The main App component.
 * It sets up all context providers and defines the application's routing structure.
 */
function App() {
  return (
    // 1. PROVIDERS: Wrap the app in context providers.
    // AuthProvider must be on the outside as other contexts may depend on it.
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            {/* 2. LAYOUT: Navbar and Footer are outside of <Routes> to be persistent across pages */}
            <Navbar />
            
            <main className="main-content">
              {/* 3. ROUTES: Define all possible pages/routes for the application */}
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/cart" element={<CartCheckout />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/search" element={<SearchResultsPage />} />
                
                {/* --- User-Specific (but not admin) Routes --- */}
                <Route path="/profile" element={<UserProfile />} />
                {/* Note: Path can be '/checkout' or '/checkoutflow' - just be consistent */}
                <Route path="/checkoutFlow" element={<CheckoutFlow />} /> 
                <Route path="/Myorders" element={<MyOrders />} />
                
                {/* --- Authentication Routes --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* --- Protected Admin Route --- */}
                {/* The /admin path and all its sub-routes are protected. */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;