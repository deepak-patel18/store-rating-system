const bcrypt = require("bcrypt");
const pool = require("../config/db");

const {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword
} = require("../utils/validation");


// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [storeCount] = await pool.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [ratingCount] = await pool.query(
      "SELECT COUNT(*) AS totalRatings FROM ratings"
    );

    res.json({
      success: true,
      data: {
        totalUsers: userCount[0].totalUsers,
        totalStores: storeCount[0].totalStores,
        totalRatings: ratingCount[0].totalRatings
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    });
  }
};


// ======================================================
// ADMIN CREATE USER
// ======================================================

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      role
    } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password, address and role are required"
      });
    }

    // ----------------------------------------------
    // Validate fields
    // ----------------------------------------------

    const nameError = validateName(name);

    if (nameError) {
      return res.status(400).json({
        success: false,
        message: nameError
      });
    }

    const emailError = validateEmail(email);

    if (emailError) {
      return res.status(400).json({
        success: false,
        message: emailError
      });
    }

    const addressError = validateAddress(address);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError
      });
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    // ----------------------------------------------
    // Validate role
    // ----------------------------------------------

    const allowedRoles = [
      "USER",
      "ADMIN",
      "STORE_OWNER"
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    // ----------------------------------------------
    // Duplicate email
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

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ----------------------------------------------
    // Insert user
    // ----------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO users
       (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        cleanAddress,
        role
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
};


// ======================================================
// ADMIN CREATE STORE
// ======================================================

const createStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      ownerId
    } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, email and address are required"
      });
    }

    // ----------------------------------------------
    // Validate store name
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

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanAddress = address.trim();

    // ----------------------------------------------
    // Check duplicate store email
    // ----------------------------------------------

    const [existingStore] = await pool.query(
      "SELECT id FROM stores WHERE email = ?",
      [cleanEmail]
    );

    if (existingStore.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Store email already exists"
      });
    }

    // ----------------------------------------------
    // Validate Store Owner
    // ----------------------------------------------

    if (ownerId) {
      const [owners] = await pool.query(
        `SELECT id
         FROM users
         WHERE id = ?
         AND role = 'STORE_OWNER'`,
        [ownerId]
      );

      if (owners.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Store Owner"
        });
      }
    }

    // ----------------------------------------------
    // Create store
    // ----------------------------------------------

    const [result] = await pool.query(
      `INSERT INTO stores
       (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [
        cleanName,
        cleanEmail,
        cleanAddress,
        ownerId || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      storeId: result.insertId
    });

  } catch (error) {
    console.error("Create store error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create store"
    });
  }
};


// ======================================================
// ADMIN LIST STORES
// SEARCH + FILTER + SORT
// ======================================================

const getStores = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "name",
      order = "asc"
    } = req.query;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(
          ROUND(AVG(r.rating), 2),
          0
        ) AS overallRating
      FROM stores s
      LEFT JOIN ratings r
        ON s.id = r.store_id
    `;

    const conditions = [];
    const values = [];

    if (name) {
      conditions.push("s.name LIKE ?");
      values.push(`%${name}%`);
    }

    if (email) {
      conditions.push("s.email LIKE ?");
      values.push(`%${email}%`);
    }

    if (address) {
      conditions.push("s.address LIKE ?");
      values.push(`%${address}%`);
    }

    if (conditions.length > 0) {
      query +=
        " WHERE " +
        conditions.join(" AND ");
    }

    query += `
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address
    `;

    const allowedSortFields = {
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "overallRating"
    };

    const selectedSortField =
      allowedSortFields[sortBy] ||
      allowedSortFields.name;

    const selectedOrder =
      order.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    query += `
      ORDER BY
      ${selectedSortField}
      ${selectedOrder}
    `;

    const [stores] = await pool.query(
      query,
      values
    );

    res.json({
      success: true,
      count: stores.length,
      filters: {
        name: name || null,
        email: email || null,
        address: address || null
      },
      sorting: {
        sortBy,
        order: selectedOrder.toLowerCase()
      },
      data: stores
    });

  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores"
    });
  }
};


// ======================================================
// ADMIN LIST USERS
// SEARCH + FILTER + SORT
// ======================================================

const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "asc"
    } = req.query;

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,

        CASE
          WHEN u.role = 'STORE_OWNER'
          THEN (
            SELECT
              COALESCE(
                ROUND(AVG(r.rating), 2),
                0
              )
            FROM stores s
            LEFT JOIN ratings r
              ON s.id = r.store_id
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END AS storeRating

      FROM users u
    `;

    const conditions = [];
    const values = [];

    if (name) {
      conditions.push("u.name LIKE ?");
      values.push(`%${name}%`);
    }

    if (email) {
      conditions.push("u.email LIKE ?");
      values.push(`%${email}%`);
    }

    if (address) {
      conditions.push("u.address LIKE ?");
      values.push(`%${address}%`);
    }

    if (role) {
      const allowedRoles = [
        "USER",
        "ADMIN",
        "STORE_OWNER"
      ];

      const normalizedRole =
        role.toUpperCase();

      if (!allowedRoles.includes(normalizedRole)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role filter"
        });
      }

      conditions.push("u.role = ?");
      values.push(normalizedRole);
    }

    if (conditions.length > 0) {
      query +=
        " WHERE " +
        conditions.join(" AND ");
    }

    const allowedSortFields = {
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role"
    };

    const selectedSortField =
      allowedSortFields[sortBy] ||
      allowedSortFields.name;

    const selectedOrder =
      order.toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    query += `
      ORDER BY
      ${selectedSortField}
      ${selectedOrder}
    `;

    const [users] = await pool.query(
      query,
      values
    );

    res.json({
      success: true,
      count: users.length,
      filters: {
        name: name || null,
        email: email || null,
        address: address || null,
        role: role || null
      },
      sorting: {
        sortBy,
        order: selectedOrder.toLowerCase()
      },
      data: users
    });

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};


// ======================================================
// ADMIN GET USER DETAILS
// ======================================================

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const [users] = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at,
        u.updated_at
       FROM users u
       WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = users[0];

    if (user.role === "STORE_OWNER") {
      const [stores] = await pool.query(
        `SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          COALESCE(
            ROUND(AVG(r.rating), 2),
            0
          ) AS averageRating
         FROM stores s
         LEFT JOIN ratings r
           ON s.id = r.store_id
         WHERE s.owner_id = ?
         GROUP BY
           s.id,
           s.name,
           s.email,
           s.address
         ORDER BY s.name ASC`,
        [id]
      );

      return res.json({
        success: true,
        data: {
          user,
          stores
        }
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error("Get user details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails
};