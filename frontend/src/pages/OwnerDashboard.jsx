import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  // ======================================================
  // LOAD OWNER DASHBOARD
  // ======================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/owner/dashboard"
      );

      setStores(response.data.data);

    } catch (error) {
      console.error(
        "Owner dashboard error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ======================================================
  // PASSWORD FORM
  // ======================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ======================================================
  // UPDATE PASSWORD
  // ======================================================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");

    try {
      const response = await api.put(
        "/auth/change-password",
        passwordForm
      );

      setPasswordMessage(
        response.data.message ||
        "Password updated successfully"
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: ""
      });

    } catch (error) {
      setPasswordMessage(
        error.response?.data?.message ||
        "Failed to update password"
      );
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="owner-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="owner-header">

        <div>
          <h1>Store Owner Dashboard</h1>

          <p>
            Welcome, {user?.name}
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      <main className="owner-container">

        {message && (
          <div className="message">
            {message}
          </div>
        )}


        {/* ==================================================
            STORE DASHBOARD
        ================================================== */}

        <section>

          <h2>My Stores</h2>

          {loading ? (
            <p>Loading dashboard...</p>
          ) : stores.length === 0 ? (
            <p>No stores assigned.</p>
          ) : (

            stores.map((store) => (

              <div
                className="owner-store-card"
                key={store.id}
              >

                <div className="store-information">

                  <h3>{store.name}</h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {store.email}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {store.address}
                  </p>

                </div>


                {/* ==================================================
                    RATING SUMMARY
                ================================================== */}

                <div className="rating-summary">

                  <div className="rating-box">

                    <span>
                      Average Rating
                    </span>

                    <strong>
                      {store.averageRating ?? 0}
                    </strong>

                  </div>

                  <div className="rating-box">

                    <span>
                      Total Ratings
                    </span>

                    <strong>
                      {store.totalRatings ?? 0}
                    </strong>

                  </div>

                </div>


                {/* ==================================================
                    USERS WHO RATED
                ================================================== */}

                <div className="ratings-list">

                  <h3>
                    Users Who Submitted Ratings
                  </h3>

                  {store.ratingUsers?.length === 0 ? (

                    <p>
                      No ratings submitted yet.
                    </p>

                  ) : (

                    <div className="table-wrapper">

                      <table>

                        <thead>

                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Rating</th>
                            <th>Rated At</th>
                          </tr>

                        </thead>

                        <tbody>

                          {store.ratingUsers.map(
                            (ratingUser) => (

                              <tr
                                key={ratingUser.userId}
                              >

                                <td>
                                  {ratingUser.name}
                                </td>

                                <td>
                                  {ratingUser.email}
                                </td>

                                <td>
                                  {ratingUser.address}
                                </td>

                                <td>
                                  {ratingUser.rating}
                                </td>

                                <td>
                                  {new Date(
                                    ratingUser.updatedAt
                                  ).toLocaleString()}
                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </div>

            ))

          )}

        </section>


        {/* ==================================================
            CHANGE PASSWORD
        ================================================== */}

        <section className="password-panel">

          <h2>Update Password</h2>

          <form
            onSubmit={handleChangePassword}
          >

            <div>
              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordForm.currentPassword
                }
                onChange={handlePasswordChange}
                required
              />
            </div>


            <div>
              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordForm.newPassword
                }
                onChange={handlePasswordChange}
                minLength="8"
                maxLength="16"
                required
                placeholder="8-16 characters"
              />
            </div>


            <button
              type="submit"
              className="password-button"
            >
              Update Password
            </button>

          </form>

          {passwordMessage && (
            <p className="message">
              {passwordMessage}
            </p>
          )}

        </section>

      </main>

    </div>
  );
};

export default OwnerDashboard;