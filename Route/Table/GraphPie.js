const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to get sales data by product category for pie chart
router.get('/category-sales', async (req, res) => {
  try {
    const query = `
      SELECT 
        CASE
          WHEN product_code LIKE 'A%' THEN 'Shoes'
          WHEN product_code LIKE 'B%' THEN 'Socks'
          WHEN product_code LIKE 'D%' THEN 'Mask'
          WHEN product_code LIKE 'E%' THEN 'Hair clip'
          WHEN product_code LIKE 'F%' THEN 'Bag'
          ELSE 'Others'
        END as Category,
        COUNT(*) as ProductCount,
        FLOOR(AVG(Quantity)) as AvgQuantity,
        FLOOR(AVG(Total_Sale)) as AvgTotalSale
      FROM product_sales 
      GROUP BY 
        CASE
          WHEN product_code LIKE 'A%' THEN 'Shoes'
          WHEN product_code LIKE 'B%' THEN 'Socks'
          WHEN product_code LIKE 'D%' THEN 'Mask'
          WHEN product_code LIKE 'E%' THEN 'Hair clip'
          WHEN product_code LIKE 'F%' THEN 'Bag'
          ELSE 'Others'
        END
      ORDER BY AvgTotalSale DESC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching category sales data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;