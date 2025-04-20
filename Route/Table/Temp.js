const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to fetch temp data and display as HTML
router.get("/html", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM temp");
    
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    console.log("Fetched rows:", rows);
    console.log("Fields:", fields);
    
    res.render("pages/Crudform", {
      title: "temp Details",
      fields: fields,
      rows: rows,
      table_name: "temp",
      primary_key: "id",
    });
    
  } catch (err) {
    console.error("Error fetching temp data:", err);
    res.status(500).json({ error: "Error fetching temp data", details: err.message });
  }
});

// Route to fetch all temp data (JSON format)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM temp');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET temp by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM temp WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'temp not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new temp
router.post('/', async (req, res) => {
  const { date, type, last_trained_date, lstm_temp, best_params } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO temp (date, Temp) VALUES (?, ?)',
      [date, type, last_trained_date, JSON.stringify(lstm_temp), JSON.stringify(best_params)]
    );
    res.status(201).json({ 
      id: result.insertId, 
      date, 
      Temp, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT/UPDATE temp
router.put('/:id', async (req, res) => {
  const { date, type, last_trained_date, lstm_temp, best_params } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE temp SET date = ?, Temp = ? WHERE id = ?',
      [date, type, last_trained_date, JSON.stringify(lstm_temp), JSON.stringify(best_params), req.params.id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'temp not found' });
    } else {
      res.json({ 
        id: parseInt(req.params.id), 
        date, 
        Temp, 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE temp
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM temp WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'temp not found' });
    } else {
      res.json({ message: 'temp deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;