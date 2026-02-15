import { Navigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    const token = store.token || localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
