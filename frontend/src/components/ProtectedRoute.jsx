import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


// ======================================================
// PROTECTED ROUTE
// ======================================================

const ProtectedRoute = ({
  children,
  allowedRoles
}) => {

  const {
    user
  } = useAuth();


  // ----------------------------------------------
  // Not logged in
  // ----------------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // ----------------------------------------------
  // Role restriction
  // ----------------------------------------------

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
};


export default ProtectedRoute;