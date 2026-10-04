import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(
        email,
        password
      );

      const role = response.user.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "USER") {
        navigate("/user/stores");
      } else if (role === "STORE_OWNER") {
        navigate("/owner");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="auth-brand">
          <span>★</span>
          StoreRate
        </div>

        <div className="auth-left-content">

          <div className="auth-small-title">
            STORE RATING PLATFORM
          </div>

          <h1>
            Welcome back.
            <br />
            <span>Let's get started.</span>
          </h1>

          <p>
            Sign in to manage your ratings,
            stores and customer feedback.
          </p>

        </div>

      </div>


      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Welcome Back 
            </h2>

            <p>
              Sign in to your StoreRate account
            </p>

          </div>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <p className="auth-bottom-text">
            Don't have an account?
            {" "}
            <Link to="/signup">
              Create an account
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

export default Login;