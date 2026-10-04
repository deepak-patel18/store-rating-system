import {
  createContext,
  useContext,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);


// ======================================================
// AUTH PROVIDER
// ======================================================

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  // ====================================================
  // LOGIN
  // ====================================================

  const login = async (email, password) => {

    const response = await api.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    const {
      token,
      user
    } = response.data;

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

    return response.data;
  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };


  // ====================================================
  // SIGNUP
  // ====================================================

  const signup = async (
    name,
    email,
    address,
    password
  ) => {

    const response = await api.post(
      "/auth/signup",
      {
        name,
        email,
        address,
        password
      }
    );

    return response.data;
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ======================================================
// CUSTOM HOOK
// ======================================================

export const useAuth = () => {
  return useContext(AuthContext);
};