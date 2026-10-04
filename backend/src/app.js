const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Store Rating System API is running"
  });
});


// ======================================================
// DATABASE TEST
// ======================================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT 1 AS result"
    );

    res.json({
      success: true,
      message: "MySQL database connected successfully",
      data: rows
    });

  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});


// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// ADMIN ROUTES
// ======================================================

app.use(
  "/api/admin",
  adminRoutes
);


// ======================================================
// NORMAL USER ROUTES
// ======================================================

app.use(
  "/api/user",
  userRoutes
);


// ======================================================
// STORE OWNER ROUTES
// ======================================================

app.use(
  "/api/owner",
  ownerRoutes
);


module.exports = app;