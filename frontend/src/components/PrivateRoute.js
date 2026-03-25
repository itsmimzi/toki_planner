import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from './AuthContext';  


function PrivateRoute ({ children }) {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/home" state={{ from: location }} replace={true} />;
    }
    return children;  
}
export default PrivateRoute;



