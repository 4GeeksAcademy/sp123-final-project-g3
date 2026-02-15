import { Navigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PublicRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    const location = useLocation();

    const token = store.token || localStorage.getItem("token");

    if (token) {
        const from = location.state?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

    return children;
};

export default PublicRoute;
