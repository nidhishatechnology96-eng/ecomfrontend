import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component wraps around any route that needs admin protection
function ProtectedRoute({ children }) {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();

    // 1. Check if a user is logged in
    if (!currentUser) {
        // If not logged in, redirect to the login page
        // We also pass the original location they tried to visit
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check if the logged-in user is an admin
    const isAdmin = currentUser.email && currentUser.email.toLowerCase().endsWith('@admin.com');
    
    if (!isAdmin) {
        // If logged in but NOT an admin, redirect to the home page
        // You could also create a dedicated "Not Authorized" page
        return <Navigate to="/" replace />;
    }

    // 3. If all checks pass, render the component they were trying to access
    return children;
}

export default ProtectedRoute;