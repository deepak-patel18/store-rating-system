const express = require("express");

const {
  getStores,
  submitRating
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// STORE LIST
// ======================================================

router.get(
  "/stores",
  authMiddleware,
  roleMiddleware("USER"),
  getStores
);


// ======================================================
// SUBMIT / MODIFY RATING
// ======================================================

router.post(
  "/stores/:storeId/rating",
  authMiddleware,
  roleMiddleware("USER"),
  submitRating
);


module.exports = router;