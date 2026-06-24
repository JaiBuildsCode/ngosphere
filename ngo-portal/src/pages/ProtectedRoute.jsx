import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // 1. Check if the keycard exists in the browser's memory
    const token = localStorage.getItem('adminToken');

    // 2. If no token is found, kick them instantly back to the login page
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 3. If they have a token, render the protected component (the children)
    return children;
};

export default ProtectedRoute;