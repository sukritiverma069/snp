import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../stores';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="route-loading">
                <h2>Loading...</h2>
                <p>Checking authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;