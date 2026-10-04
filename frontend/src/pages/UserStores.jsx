import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./UserStores.css";

const UserStores = () => {
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    address: ""
  });

  const [ratings, setRatings] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [loading, setLoading] = useState(true);


  // ======================================================
  // LOAD STORES
  // ======================================================

  const loadStores = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/user/stores",
        {
          params: filters
        }
      );

      setStores(response.data.data);

    } catch (error) {
      console.error(
        "Store loading error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to load stores"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStores();
  }, []);


  // ======================================================
  // FILTER
  // ======================================================

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleSearch = async (event) => {
    event.preventDefault();

    await loadStores();
  };


  // ======================================================
  // RATING
  // ======================================================

  const handleRatingChange = (
    storeId,
    value
  ) => {
    setRatings((previous) => ({
      ...previous,
      [storeId]: value
    }));
  };


  const handleSubmitRating = async (
    storeId
  ) => {

    const rating = ratings[storeId];

    if (!rating) {
      setMessage(
        "Please select a rating from 1 to 5"
      );
      return;
    }

    try {
      setMessage("");

      await api.post(
        `/user/stores/${storeId}/rating`,
        {
          rating: Number(rating)
        }
      );

      setMessage(
        "Rating submitted successfully"
      );

      await loadStores();

    } catch (error) {
      console.error(
        "Rating error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to submit rating"
      );
    }
  };


  // ======================================================
  // PASSWORD
  // ======================================================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleChangePassword = async (
    event
  ) => {

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
    <div className="user-page">

      {/* HEADER */}

      <header className="user-header">

        <div>
          <h1>Store Rating System</h1>

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


      <main className="user-container">

        {/* SEARCH */}

        <section className="search-panel">

          <h2>Find Stores</h2>

          <form
            className="search-form"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search by store name"
            />

            <input
              type="text"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Search by address"
            />

            <button
              type="submit"
              className="search-button"
            >
              Search
            </button>

          </form>

        </section>


        {message && (
          <div className="message">
            {message}
          </div>
        )}


        {/* STORE LIST */}

        <section>

          <h2>Available Stores</h2>

          {loading ? (

            <p>
              Loading stores...
            </p>

          ) : stores.length === 0 ? (

            <p>
              No stores found.
            </p>

          ) : (

            <div className="store-grid">

              {stores.map((store) => (

                <div
                  className="store-card"
                  key={store.id}
                >

                  <h3>
                    {store.name}
                  </h3>

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {store.address}
                  </p>

                  <p>
                    <strong>
                      Overall Rating:
                    </strong>{" "}
                    {store.averageRating ?? 0}
                  </p>

                  <p>
                    <strong>
                      Your Rating:
                    </strong>{" "}
                    {store.userRating ??
                      "Not submitted"}
                  </p>


                  <div className="rating-section">

                    <label>
                      {store.userRating
                        ? "Modify your rating"
                        : "Submit your rating"}
                    </label>

                    <select
                      value={
                        ratings[store.id] ??
                        store.userRating ??
                        ""
                      }
                      onChange={(event) =>
                        handleRatingChange(
                          store.id,
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select rating
                      </option>

                      <option value="1">
                        1 - Very Poor
                      </option>

                      <option value="2">
                        2 - Poor
                      </option>

                      <option value="3">
                        3 - Average
                      </option>

                      <option value="4">
                        4 - Good
                      </option>

                      <option value="5">
                        5 - Excellent
                      </option>

                    </select>

                    <button
                      className="rating-button"
                      onClick={() =>
                        handleSubmitRating(
                          store.id
                        )
                      }
                    >
                      {store.userRating
                        ? "Update Rating"
                        : "Submit Rating"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* PASSWORD */}

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
                onChange={
                  handlePasswordChange
                }
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
                onChange={
                  handlePasswordChange
                }
                minLength="8"
                maxLength="16"
                required
                placeholder="8-16 characters"
              />
            </div>

            <button
              type="submit"
              className="rating-button"
            >
              Update Password
            </button>

          </form>

          {passwordMessage && (
            <div className="message">
              {passwordMessage}
            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default UserStores;