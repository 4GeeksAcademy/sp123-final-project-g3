import "../index.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import mascotgif from "../imagenes/robotlogin.gif";
import logo from "../imagenes/logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { actions } = useGlobalReducer();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (name, value) => {
        let error = "";

        if (!value.trim()) {
            error = "This field is required";
        } else {
            if (name === "email" && !value.includes("@")) {
                error = "Invalid email address";
            }
            if (name === "password" && value.length < 6) {
                error = "Minimum 6 characters";
            }
        }

        return error;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm({ ...form, [name]: value });

        setErrors({
            ...errors,
            [name]: validate(name, value),
        });

        setLoginError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let newErrors = {};
        Object.keys(form).forEach((key) => {
            const error = validate(key, form[key]);
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);

            // Validación explícita según metodología 4Geeks (Flux Pattern)
            const success = await actions.login(form.email, form.password);
            setLoading(false);

            if (success) {
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            } else {
                setLoginError("Invalid credentials");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-form">
                    <div className="login-logo-form d-flex align-items-center mb-3">
                        <div className="logo-shape-1"></div>
                        <div className="logo-shape-2"></div>
                        <img src={logo} alt="logo" className="logo-image" />
                        <h3 className="fw-bold ms-2">Super cool future name!</h3>
                    </div>

                    <h1 className="fw-semibold ms-3">Login</h1>
                    <p className="login-subtitle ms-3">
                        Log in to access your job board
                    </p>

                    {loginError && <div className="alert alert-danger">{loginError}</div>}

                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="john.doe@gmail.com"
                                value={form.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="••••••••••••"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.password && (
                                <div className="alert alert-danger mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" />
                                <label className="form-check-label">Remember me</label>
                            </div>
                            <Link to="/recover-password" className="fw-medium">
                                Forgot your password?
                            </Link>
                        </div>

                        <button
                            className="btn btn-primary w-100 mb-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>

                        <p className="text-center">
                            Don't have an account yet?{" "}
                            <Link to="/register" className="fw-semibold">
                                Sign up
                            </Link>
                        </p>

                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1" />
                            <span className="mx-3 text-muted">Or log in with</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <div className="d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    const success = await actions.loginWithGoogle(credentialResponse.credential);
                                    if (success) {
                                        const from = location.state?.from?.pathname || "/";
                                        navigate(from, { replace: true });
                                    } else {
                                        setLoginError("Google Login Failed");
                                    }
                                }}
                                onError={() => {
                                    setLoginError("Google Login Failed");
                                }}
                            />
                        </div>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <img src={mascotgif} alt="login visual" className="login-image" />
                    <div className="d-flex gap-2 mt-3 justify-content-center login-indicators">
                        <div className="indicator active"></div>
                        <div className="indicator active"></div>
                        <div className="indicator"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
