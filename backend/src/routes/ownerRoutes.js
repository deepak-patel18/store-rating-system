const express = require("express");

const {
  getDashboard
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// STORE OWNER DASHBOARD
// ======================================================

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("STORE_OWNER"),
  getDashboard
);


module.exports = router;