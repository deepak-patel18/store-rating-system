const express = require("express");

const {
  signup,
  login,
  changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// SIGNUP
// ======================================================

router.post(
  "/signup",
  signup
);


// ======================================================
// LOGIN
// ======================================================

router.post(
  "/login",
  login
);


// ======================================================
// PROFILE
// ======================================================

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "You accessed a protected route",
      user: req.user
    });
  }
);


// ======================================================
// CHANGE PASSWORD
// USER + STORE OWNER + ADMIN
// ======================================================

router.put(
  "/change-password",
  authMiddleware,
  roleMiddleware(
    "USER",
    "STORE_OWNER",
    "ADMIN"
  ),
  changePassword
);


// ======================================================
// ADMIN TEST
// ======================================================

router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin"
    });
  }
);


module.exports = router;