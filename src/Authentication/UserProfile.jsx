import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate, Link } from "react-router-dom"; 

function UserProfile() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm w-100" style={{ maxWidth: "640px" }}>
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">User Profile</h3>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="form-label text-muted small">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={currentUser.email}
              disabled
              readOnly
            />
          </div>
          
          {/* 👇 --- LINK CORRECTED --- */}
          <div className="d-grid">
            <Link to="/myorders" className="btn btn-primary">
              <i className="bi bi-receipt-cutoff me-2"></i>View My Orders
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserProfile;