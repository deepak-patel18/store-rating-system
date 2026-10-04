const pool = require("../config/db");


// ======================================================
// GET ALL STORES FOR NORMAL USER
// SEARCH BY NAME / ADDRESS
// SHOW OVERALL RATING + USER'S RATING
// ======================================================

const getStores = async (req, res) => {
  try {
    const {
      name,
      address,
      sortBy = "name",
      order = "asc"
    } = req.query;

    const userId = req.user.id;

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,

        COALESCE(
          ROUND(AVG(allRatings.rating), 2),
          0
        ) AS overallRating,

        userRating.rating AS userRating

      FROM stores s

      LEFT JOIN ratings allRatings
        ON s.id = allRatings.store_id

      LEFT JOIN ratings userRating
        ON s.id = userRating.store_id
        AND userRating.user_id = ?
    `;

    const values = [userId];

    const conditions = [];

    if (name) {
      conditions.push("s.name LIKE ?");
      values.push(`%${name}%`);
    }

    if (address) {
      conditions.push("s.address LIKE ?");
      values.push(`%${address}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += `
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        userRating.rating
    `;

    const allowedSortFields = {
      name: "s.name",
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
      ORDER BY ${selectedSortField} ${selectedOrder}
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
        address: address || null
      },
      sorting: {
        sortBy,
        order: selectedOrder.toLowerCase()
      },
      data: stores
    });

  } catch (error) {
    console.error("Get user stores error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores"
    });
  }
};


// ======================================================
// SUBMIT OR MODIFY RATING
// ======================================================

const submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;

    // Validate store ID
    if (!storeId || isNaN(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID"
      });
    }

    // Validate rating
    if (
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating is required"
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5"
      });
    }

    // Check whether store exists
    const [stores] = await pool.query(
      `SELECT id, name
       FROM stores
       WHERE id = ?`,
      [storeId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    // Check whether this user has already rated this store
    const [existingRatings] = await pool.query(
      `SELECT id, rating
       FROM ratings
       WHERE user_id = ?
       AND store_id = ?`,
      [
        userId,
        storeId
      ]
    );

    // ==================================================
    // MODIFY EXISTING RATING
    // ==================================================

    if (existingRatings.length > 0) {
      const ratingId = existingRatings[0].id;

      await pool.query(
        `UPDATE ratings
         SET rating = ?
         WHERE id = ?`,
        [
          numericRating,
          ratingId
        ]
      );

      return res.json({
        success: true,
        message: "Rating updated successfully",
        data: {
          ratingId,
          storeId: Number(storeId),
          rating: numericRating
        }
      });
    }

    // ==================================================
    // CREATE NEW RATING
    // ==================================================

    const [result] = await pool.query(
      `INSERT INTO ratings
       (user_id, store_id, rating)
       VALUES (?, ?, ?)`,
      [
        userId,
        storeId,
        numericRating
      ]
    );

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        ratingId: result.insertId,
        storeId: Number(storeId),
        rating: numericRating
      }
    });

  } catch (error) {
    console.error("Submit rating error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit rating"
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getStores,
  submitRating
};