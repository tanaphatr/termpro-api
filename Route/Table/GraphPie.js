const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to get sales data by product category for pie chart
router.get('/category-sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate the date range
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing startDate or endDate' });
    }

    const dateCondition = `Date BETWEEN '${startDate}' AND '${endDate}'`;

    const query = `
      SELECT Category, SUM(Sales) AS TotalSales
      FROM SalesData
      WHERE ${dateCondition}
      GROUP BY Category
      ORDER BY TotalSales DESC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching category sales data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
