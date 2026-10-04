const pool = require("../config/db");


// ======================================================
// STORE OWNER DASHBOARD
// ======================================================

const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // ==================================================
    // FIND STORE OWNED BY CURRENT USER
    // ==================================================

    const [stores] = await pool.query(
      `SELECT
        id,
        name,
        email,
        address
       FROM stores
       WHERE owner_id = ?`,
      [ownerId]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store assigned to this Store Owner"
      });
    }

    // ==================================================
    // GET STORE + AVERAGE RATING + RATING USERS
    // ==================================================

    const storeData = [];

    for (const store of stores) {

      // ----------------------------------------------
      // Average rating
      // ----------------------------------------------

      const [ratingResult] = await pool.query(
        `SELECT
          COALESCE(
            ROUND(AVG(rating), 2),
            0
          ) AS averageRating,

          COUNT(*) AS totalRatings

         FROM ratings

         WHERE store_id = ?`,
        [store.id]
      );

      // ----------------------------------------------
      // Users who submitted ratings
      // ----------------------------------------------

      const [ratingUsers] = await pool.query(
        `SELECT
          u.id AS userId,
          u.name,
          u.email,
          u.address,
          r.rating,
          r.created_at AS ratedAt,
          r.updated_at AS updatedAt

         FROM ratings r

         INNER JOIN users u
           ON r.user_id = u.id

         WHERE r.store_id = ?

         ORDER BY r.updated_at DESC`,
        [store.id]
      );

      storeData.push({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: ratingResult[0].averageRating,
        totalRatings: ratingResult[0].totalRatings,
        ratingUsers
      });
    }

    res.json({
      success: true,
      data: storeData
    });

  } catch (error) {
    console.error("Store owner dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load Store Owner dashboard"
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getDashboard
};