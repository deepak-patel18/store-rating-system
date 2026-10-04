import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    order: "asc"
  });

  const [storeFilters, setStoreFilters] = useState({
    name: "",
    email: "",
    address: "",
    sortBy: "name",
    order: "asc"
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [userMessage, setUserMessage] = useState("");
  const [storeMessage, setStoreMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [loading, setLoading] = useState(false);


  // ======================================================
  // LOAD DASHBOARD
  // ======================================================

  const loadDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard");

      setStats(response.data.data);

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };


  // ======================================================
  // LOAD USERS
  // ======================================================

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users", {
        params: userFilters
      });

      setUsers(response.data.data);

    } catch (error) {
      console.error("Users error:", error);
    }
  };


  // ======================================================
  // LOAD STORES
  // ======================================================

  const loadStores = async () => {
    try {
      const response = await api.get("/admin/stores", {
        params: storeFilters
      });

      setStores(response.data.data);

    } catch (error) {
      console.error("Stores error:", error);
    }
  };


  // ======================================================
  // LOAD STORE OWNERS
  // ======================================================

  const loadStoreOwners = async () => {
    try {
      const response = await api.get("/admin/users", {
        params: {
          role: "STORE_OWNER",
          sortBy: "name",
          order: "asc"
        }
      });

      setStoreOwners(response.data.data);

    } catch (error) {
      console.error(
        "Store owners error:",
        error
      );
    }
  };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadDashboard();
    loadUsers();
    loadStores();
    loadStoreOwners();
  }, []);


  // ======================================================
  // USER FILTER
  // ======================================================

  const handleUserFilterChange = (event) => {
    const { name, value } = event.target;

    setUserFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleUserSearch = async (event) => {
    event.preventDefault();

    await loadUsers();
  };


  // ======================================================
  // STORE FILTER
  // ======================================================

  const handleStoreFilterChange = (event) => {
    const { name, value } = event.target;

    setStoreFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleStoreSearch = async (event) => {
    event.preventDefault();

    await loadStores();
  };


  // ======================================================
  // CREATE USER
  // ======================================================

  const handleUserFormChange = (event) => {
    const { name, value } = event.target;

    setUserForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleCreateUser = async (event) => {
    event.preventDefault();

    setUserMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/admin/users",
        userForm
      );

      setUserMessage(
        response.data.message ||
        "User created successfully"
      );

      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
      });

      await loadDashboard();
      await loadUsers();
      await loadStoreOwners();

    } catch (error) {
      setUserMessage(
        error.response?.data?.message ||
        "Failed to create user"
      );

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // CREATE STORE
  // ======================================================

  const handleStoreFormChange = (event) => {
    const { name, value } = event.target;

    setStoreForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  const handleCreateStore = async (event) => {
    event.preventDefault();

    setStoreMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/admin/stores",
        {
          name: storeForm.name,
          email: storeForm.email,
          address: storeForm.address,
          ownerId: storeForm.ownerId
            ? Number(storeForm.ownerId)
            : null
        }
      );

      setStoreMessage(
        response.data.message ||
        "Store created successfully"
      );

      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: ""
      });

      await loadDashboard();
      await loadStores();

    } catch (error) {
      setStoreMessage(
        error.response?.data?.message ||
        "Failed to create store"
      );

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // USER DETAILS
  // ======================================================

  const handleViewUser = async (userId) => {
    try {
      const response = await api.get(
        `/admin/users/${userId}`
      );

      setSelectedUser(response.data.data);

    } catch (error) {
      console.error(
        "User details error:",
        error
      );
    }
  };


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
  // CHANGE PASSWORD
  // ======================================================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setLoading(true);

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

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    logout();
  };


  return (
    <div className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

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


      <main className="admin-container">

        {/* STATISTICS */}

        <section className="stats-section">

          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="stat-card">
            <h3>Total Stores</h3>
            <p>{stats.totalStores}</p>
          </div>

          <div className="stat-card">
            <h3>Total Ratings</h3>
            <p>{stats.totalRatings}</p>
          </div>

        </section>


        {/* CREATE USER */}

        <section className="panel">

          <h2>Create User</h2>

          <form
            className="form-grid"
            onSubmit={handleCreateUser}
          >

            <div>
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                minLength="20"
                maxLength="60"
                required
                placeholder="20-60 characters"
              />
            </div>

            <div>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div>
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                minLength="8"
                maxLength="16"
                required
                placeholder="8-16 characters"
              />
            </div>

            <div>
              <label>Role</label>

              <select
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
              >
                <option value="USER">
                  Normal User
                </option>

                <option value="STORE_OWNER">
                  Store Owner
                </option>

                <option value="ADMIN">
                  Administrator
                </option>
              </select>
            </div>

            <div className="full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={userForm.address}
                onChange={handleUserFormChange}
                maxLength="400"
                required
                placeholder="Enter address"
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </button>

          </form>

          {userMessage && (
            <p className="message">
              {userMessage}
            </p>
          )}

        </section>


        {/* CREATE STORE */}

        <section className="panel">

          <h2>Create Store</h2>

          <form
            className="form-grid"
            onSubmit={handleCreateStore}
          >

            <div>
              <label>Store Name</label>

              <input
                type="text"
                name="name"
                value={storeForm.name}
                onChange={handleStoreFormChange}
                minLength="20"
                maxLength="60"
                required
                placeholder="20-60 characters"
              />
            </div>

            <div>
              <label>Store Email</label>

              <input
                type="email"
                name="email"
                value={storeForm.email}
                onChange={handleStoreFormChange}
                required
                placeholder="Enter store email"
              />
            </div>

            <div>
              <label>Store Owner</label>

              <select
                name="ownerId"
                value={storeForm.ownerId}
                onChange={handleStoreFormChange}
              >
                <option value="">
                  No owner
                </option>

                {storeOwners.map((owner) => (
                  <option
                    key={owner.id}
                    value={owner.id}
                  >
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={storeForm.address}
                onChange={handleStoreFormChange}
                maxLength="400"
                required
                placeholder="Enter store address"
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Store"}
            </button>

          </form>

          {storeMessage && (
            <p className="message">
              {storeMessage}
            </p>
          )}

        </section>


        {/* USERS */}

        <section className="panel">

          <h2>Users</h2>

          <form
            className="filter-grid"
            onSubmit={handleUserSearch}
          >

            <input
              type="text"
              name="name"
              value={userFilters.name}
              onChange={handleUserFilterChange}
              placeholder="Search by name"
            />

            <input
              type="text"
              name="email"
              value={userFilters.email}
              onChange={handleUserFilterChange}
              placeholder="Search by email"
            />

            <input
              type="text"
              name="address"
              value={userFilters.address}
              onChange={handleUserFilterChange}
              placeholder="Search by address"
            />

            <select
              name="role"
              value={userFilters.role}
              onChange={handleUserFilterChange}
            >
              <option value="">
                All Roles
              </option>

              <option value="USER">
                Normal User
              </option>

              <option value="ADMIN">
                Administrator
              </option>

              <option value="STORE_OWNER">
                Store Owner
              </option>
            </select>

            <select
              name="sortBy"
              value={userFilters.sortBy}
              onChange={handleUserFilterChange}
            >
              <option value="name">
                Sort by Name
              </option>

              <option value="email">
                Sort by Email
              </option>

              <option value="address">
                Sort by Address
              </option>

              <option value="role">
                Sort by Role
              </option>
            </select>

            <select
              name="order"
              value={userFilters.order}
              onChange={handleUserFilterChange}
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>

            <button
              type="submit"
              className="primary-button"
            >
              Search
            </button>

          </form>


          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Store Rating</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {users.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="empty"
                    >
                      No users found
                    </td>
                  </tr>

                ) : (

                  users.map((item) => (

                    <tr key={item.id}>

                      <td>{item.name}</td>

                      <td>{item.email}</td>

                      <td>{item.address}</td>

                      <td>{item.role}</td>

                      <td>
                        {item.storeRating ?? "-"}
                      </td>

                      <td>
                        <button
                          className="small-button"
                          onClick={() =>
                            handleViewUser(item.id)
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* STORES */}

        <section className="panel">

          <h2>Stores</h2>

          <form
            className="filter-grid"
            onSubmit={handleStoreSearch}
          >

            <input
              type="text"
              name="name"
              value={storeFilters.name}
              onChange={handleStoreFilterChange}
              placeholder="Search by store name"
            />

            <input
              type="text"
              name="email"
              value={storeFilters.email}
              onChange={handleStoreFilterChange}
              placeholder="Search by email"
            />

            <input
              type="text"
              name="address"
              value={storeFilters.address}
              onChange={handleStoreFilterChange}
              placeholder="Search by address"
            />

            <select
              name="sortBy"
              value={storeFilters.sortBy}
              onChange={handleStoreFilterChange}
            >
              <option value="name">
                Sort by Name
              </option>

              <option value="email">
                Sort by Email
              </option>

              <option value="address">
                Sort by Address
              </option>

              <option value="rating">
                Sort by Rating
              </option>
            </select>

            <select
              name="order"
              value={storeFilters.order}
              onChange={handleStoreFilterChange}
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>

            <button
              type="submit"
              className="primary-button"
            >
              Search
            </button>

          </form>


          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>

                {stores.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="empty"
                    >
                      No stores found
                    </td>
                  </tr>

                ) : (

                  stores.map((store) => (

                    <tr key={store.id}>

                      <td>{store.name}</td>

                      <td>{store.email}</td>

                      <td>{store.address}</td>

                      <td>
                        {store.averageRating ?? 0}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* USER DETAILS */}

        {selectedUser && (

          <section className="panel">

            <div className="details-header">

              <h2>User Details</h2>

              <button
                className="small-button"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                Close
              </button>

            </div>

            <div className="details-grid">

              <p>
                <strong>Name:</strong>{" "}
                {selectedUser.user.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedUser.user.email}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {selectedUser.user.address}
              </p>

              <p>
                <strong>Role:</strong>{" "}
                {selectedUser.user.role}
              </p>

            </div>


            {selectedUser.user.role ===
              "STORE_OWNER" && (

              <div>

                <h3>Owned Stores</h3>

                {selectedUser.stores?.length === 0 ? (

                  <p>
                    No stores assigned.
                  </p>

                ) : (

                  <div className="table-wrapper">

                    <table>

                      <thead>
                        <tr>
                          <th>Store</th>
                          <th>Email</th>
                          <th>Address</th>
                          <th>Average Rating</th>
                        </tr>
                      </thead>

                      <tbody>

                        {selectedUser.stores.map(
                          (store) => (

                            <tr key={store.id}>

                              <td>
                                {store.name}
                              </td>

                              <td>
                                {store.email}
                              </td>

                              <td>
                                {store.address}
                              </td>

                              <td>
                                {store.averageRating}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            )}

          </section>

        )}


        {/* CHANGE PASSWORD */}

        <section className="panel">

          <h2>Update Password</h2>

          <form
            className="password-form"
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
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Password"}
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

export default AdminDashboard;