const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to get sales data by product code
router.get('/sales', async (req, res) => {
  try {
    const query = `
      SELECT 
        product_code as Product_code,
        FLOOR(AVG(Quantity)) as Quantity,
        FLOOR(AVG(Total_Sale)) as Total_Sale
      FROM product_sales 
      GROUP BY product_code
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error calculating averages:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;