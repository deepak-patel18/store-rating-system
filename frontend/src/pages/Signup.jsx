import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signup(
        formData.name,
        formData.email,
        formData.address,
        formData.password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

      <div className="auth-left">

        <div className="auth-brand">
          <span>★</span>
          StoreRate
        </div>

        <div className="auth-left-content">

          <div className="auth-small-title">
            JOIN STORERATE
          </div>

          <h1>
            Create your
            <br />
            <span>account today.</span>
          </h1>

          <p>
            Join the platform and start rating
            stores with a simple and secure
            experience.
          </p>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Create Account
            </h2>

            <p>
              Enter your details to get started
            </p>

          </div>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {success && (
            <div className="success-message">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <small className="field-hint">
                20–60 characters
              </small>

            </div>


            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />

              <small className="field-hint">
                8–16 characters, one uppercase letter
                and one special character
              </small>

            </div>


            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <p className="auth-bottom-text">
            Already have an account?
            {" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>


          <Link
            to="/"
            className="back-home"
          >
            ← Back to home
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Signup;