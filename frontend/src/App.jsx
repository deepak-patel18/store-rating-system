import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  AuthProvider
} from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";

const App = () => {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* NORMAL USER */}

          <Route
            path="/user/stores"
            element={
              <ProtectedRoute
                allowedRoles={["USER"]}
              >
                <UserStores />
              </ProtectedRoute>
            }
          />

          {/* STORE OWNER */}

          <Route
            path="/owner"
            element={
              <ProtectedRoute
                allowedRoles={["STORE_OWNER"]}
              >
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
};

export default App;