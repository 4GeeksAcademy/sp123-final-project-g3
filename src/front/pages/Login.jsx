import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This page was removed in favor of integrating the login form into `Home`.
// For compatibility, this component redirects to `/` (home) immediately.
function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/');
    }, [navigate]);
    return null;
}
export default Login;
