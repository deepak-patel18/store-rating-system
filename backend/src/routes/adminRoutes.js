const express = require("express");

const {
  getDashboardStats,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// ADMIN DASHBOARD
// ======================================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboardStats
);


// ======================================================
// CREATE USER
// ======================================================

router.post(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createUser
);


// ======================================================
// LIST USERS
// SEARCH + FILTER + SORT
// ======================================================

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUsers
);


// ======================================================
// USER DETAILS
// ======================================================

router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getUserDetails
);


// ======================================================
// CREATE STORE
// ======================================================

router.post(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createStore
);


// ======================================================
// LIST STORES
// SEARCH + FILTER + SORT
// ======================================================

router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getStores
);


module.exports = router;