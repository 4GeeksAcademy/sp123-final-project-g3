import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import robotgif from "../imagenes/robotregistrogif.gif";
import logo from "../imagenes/logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Register() {
    const navigate = useNavigate();
    const { actions } = useGlobalReducer();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (name, value) => {
        let error = "";

        switch (name) {
            case "email":
                if (!value.trim()) {
                    error = "This field is required";
                } else if (!value.includes("@")) {
                    error = "Invalid email";
                }
                break;

            case "password":
                if (!value.trim()) {
                    error = "This field is required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
                }
                break;

            default:
                break;
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

        setRegisterError("");
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
            setRegisterError("");

            // Validación explícita según metodología 4Geeks (Flux Pattern)
            const success = await actions.signup(form.email, form.password);

            if (success) {
                const loginSuccess = await actions.login(form.email, form.password);
                if (loginSuccess) {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 2000);
                } else {
                    setRegisterError("Registration successful but login failed.");
                }
            } else {
                setRegisterError("Error registering user");
            }
            setLoading(false);
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

                    <h1 className="fw-semibold ms-3">Create your account</h1>
                    <p className="login-subtitle ms-3">
                        Create your new account to get started
                    </p>

                    {success && (
                        <div className="alert alert-success">
                            Registration completed! Redirecting...
                        </div>
                    )}

                    {registerError && (
                        <div className="alert alert-danger">{registerError}</div>
                    )}

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
                                disabled={loading || success}
                            />
                            {errors.email && (
                                <div className="alert alert-danger mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Create password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="••••••••••••"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading || success}
                            />
                            {errors.password && (
                                <div className="alert alert-danger mt-1">{errors.password}</div>
                            )}
                        </div>

                        <button
                            className="btn btn-primary w-100 mb-3"
                            type="submit"
                            disabled={loading || success}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                        <p className="text-center">
                            Already have an account?{" "}
                            <Link to="/" className="fw-semibold">
                                Log in
                            </Link>
                        </p>

                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1" />
                            <span className="mx-3 text-muted">Or register with</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-primary flex-fill" type="button">
                                Facebook
                            </button>
                            <button className="btn btn-outline-primary flex-fill" type="button">
                                Google
                            </button>
                            <button className="btn btn-outline-primary flex-fill" type="button">
                                Apple
                            </button>
                        </div>
                    </form>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <img src={robotgif} alt="register visual" className="login-image" />
                    <div className="d-flex gap-2 mt-3 justify-content-center login-indicators">
                        <div className="indicator active"></div>
                        <div className="indicator"></div>
                        <div className="indicator"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
