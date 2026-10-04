const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword
} = require("../utils/validation");


// ======================================================
// SIGNUP
// ======================================================

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      password
    } = req.body;

    // ----------------------------------------------
    // Required fields
    // ----------------------------------------------

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // ----------------------------------------------
    // Validate name
    // ----------------------------------------------

    const nameError = validateName(name);

    if (nameError) {
      return res.status(400).json({
        success: false,
        message: nameError
      });
    }

    // ----------------------------------------------
    // Validate email
    // ----------------------------------------------

    const emailError = validateEmail(email);

    if (emailError) {
      return res.status(400).json({
        success: false,
        message: emailError
      });
    }

    // ----------------------------------------------
    // Validate address
    // ----------------------------------------------

    const addressError = validateAddress(address);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError
      });
    }

    // ----------------------------------------------
    // Validate password
    // ----------------------------------------------

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanAddress = address.trim();

    // ----------------------------------------------
    // Check duplicate email
    // ----------------------------------------------

    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // ----------------------------------------------
    // Hash password
    // ----------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ----------------------------------------------
    // Create user
    // ----------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO users
       (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'USER')`,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        cleanAddress
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ======================================================
// LOGIN
// ======================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      `SELECT
        id,
        name,
        email,
        password,
        address,
        role
       FROM users
       WHERE email = ?`,
      [cleanEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // Validate new password
    const passwordError =
      validatePassword(newPassword);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    const [users] = await pool.query(
      `SELECT password
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = users[0];

    // Check current password
    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Don't allow same password
    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password"
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    await pool.query(
      `UPDATE users
       SET password = ?
       WHERE id = ?`,
      [
        hashedPassword,
        userId
      ]
    );

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update password"
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  signup,
  login,
  changePassword
};