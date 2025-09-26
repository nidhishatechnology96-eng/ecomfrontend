import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 👈 ADDED useLocation
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 --- ADDED THIS LINE

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // 👇 --- UPDATED REDIRECTION LOGIC ---
      // 1. Check if we were redirected from another page (like the cart).
      const from = location.state?.from || null;

      // 2. Determine the default destination if 'from' is not set.
      const isAdmin = email.toLowerCase().endsWith("@admin.com");
      const defaultRedirect = isAdmin ? "/admin" : "/";
      
      // 3. Navigate to the 'from' path if it exists, otherwise use the default.
      navigate(from || defaultRedirect, { replace: true });
      
    } catch (err) {
      setError("Failed to log in. Please check your email and password.");
      console.error("Login Error:", err);
    }
    
    setLoading(false);
  };

  // ... the rest of the JSX remains the same
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <FaUserCircle className="text-success mb-3" style={{ fontSize: "60px" }} />
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted small">Login to continue to your account</p>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100 mb-3" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center small">
              <p>Don't have an account? <Link to="/signup" state={{ from: location.state?.from }}>Sign Up</Link></p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;