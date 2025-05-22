
const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to get sales data by product code
router.get('/category-sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate the date range
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing startDate or endDate' });
    }
    const dateCondition = startDate === endDate 
      ? `Date = '${startDate}'` 
      : `Date BETWEEN '${startDate}' AND '${endDate}'`;

    const query = `
      SELECT *
      FROM product_sales
      WHERE ${dateCondition}
    `;

    const [rawPieData] = await pool.query(query);

    const categoryData = rawPieData.reduce((acc, item) => {
      let category = '';
      if (item.Product_code.startsWith('A')) category = 'Shoes';
      else if (item.Product_code.startsWith('B')) category = 'Socks';
      else if (item.Product_code.startsWith('D')) category = 'Mask';
      else if (item.Product_code.startsWith('E')) category = 'Hair clip';
      else if (item.Product_code.startsWith('F')) category = 'Bag';
      if (!acc[category]) acc[category] = { category, productCount: 0 };
      acc[category].productCount += Number(item.Quantity);
      return acc;
    }, {});

    const result = Object.values(categoryData);
    res.json(result);
  } catch (error) {
    console.error('Error calculating averages:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;