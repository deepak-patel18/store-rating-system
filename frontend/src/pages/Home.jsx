import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();

  const getDashboardPath = () => {
    if (!user) {
      return "/login";
    }

    if (user.role === "ADMIN") {
      return "/admin";
    }

    if (user.role === "USER") {
      return "/user/stores";
    }

    if (user.role === "STORE_OWNER") {
      return "/owner";
    }

    return "/";
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}

      <header className="home-navbar">
        <div className="home-navbar-inner">

          <Link to="/" className="brand">
            <span className="brand-icon">★</span>
            <span>StoreRate</span>
          </Link>

          <nav className="home-nav">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="nav-link"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="nav-button"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                <span className="welcome-user">
                  Hi, {user.name}
                </span>

                <Link
                  to={getDashboardPath()}
                  className="nav-button"
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="nav-link logout-button"
                >
                  Logout
                </button>
              </>
            )}

          </nav>

        </div>
      </header>


      {/* HERO */}

      <main className="home-main">

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">
              ★ Smart Store Rating Platform
            </div>

            <h1>
              Rate stores.
              <br />
              <span>Make better choices.</span>
            </h1>

            <p className="hero-description">
              StoreRate makes it simple to discover stores,
              submit ratings, and manage customer feedback
              from one easy-to-use platform.
            </p>

            <div className="hero-buttons">

              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="hero-primary-button"
                  >
                    Get Started →
                  </Link>

                  <Link
                    to="/login"
                    className="hero-secondary-button"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  to={getDashboardPath()}
                  className="hero-primary-button"
                >
                  Open Dashboard →
                </Link>
              )}

            </div>

          </div>


          {/* HERO CARD */}

          <div className="hero-card">

            <div className="hero-card-header">
              <div className="hero-card-icon">
                ★
              </div>

              <div>
                <h3>Store Rating</h3>
                <p>Customer feedback</p>
              </div>
            </div>

            <div className="rating-display">
              <span className="rating-number">
                4.8
              </span>

              <div>
                <div className="stars">
                  ★★★★★
                </div>

                <span className="rating-text">
                  Excellent rating
                </span>
              </div>
            </div>

            <div className="rating-bars">

              <div className="rating-row">
                <span>5 ★</span>
                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              <div className="rating-row">
                <span>4 ★</span>
                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <div className="rating-row">
                <span>3 ★</span>
                <div className="rating-bar">
                  <div
                    className="rating-fill"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* FEATURES */}

        <section className="features-section">

          <div className="section-heading">
            <span>WHY STORERATE?</span>

            <h2>
              Everything you need in one place
            </h2>

            <p>
              A simple rating platform designed for
              customers, store owners and administrators.
            </p>
          </div>


          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon blue">
                ★
              </div>

              <h3>
                Simple Ratings
              </h3>

              <p>
                Submit ratings from 1 to 5 and share
                your experience with stores.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon green">
                ✓
              </div>

              <h3>
                Easy Management
              </h3>

              <p>
                Manage stores, users and ratings
                from role-based dashboards.
              </p>
            </div>


            <div className="feature-card">
              <div className="feature-icon purple">
                ◈
              </div>

              <h3>
                Useful Insights
              </h3>

              <p>
                Store owners can view ratings and
                customer feedback in one place.
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="home-footer">

  <div className="footer-left">

    <div className="footer-brand">
      <span className="footer-brand-icon">
        ★
      </span>

      <strong>
        StoreRate
      </strong>
    </div>

    <span className="footer-copyright">
      © 2026 Store Rating System
    </span>

  </div>


  <div className="footer-center">

    <span>
      Built with
    </span>

    <span className="tech-stack">
      React • Express • MySQL
    </span>

  </div>


  <div className="footer-right">

    <span className="footer-created">
      Built by <strong>Deepak Patel</strong>
    </span>

    <div className="social-links">

      <a
        href="https://github.com/deepak-patel18"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        GitHub
      </a>

      <a
        href="https://www.linkedin.com/in/deepakpatel18/"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
      >
        LinkedIn
      </a>

    </div>

  </div>

</footer>

    </div>
  );
};

export default Home;