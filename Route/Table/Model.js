const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to fetch model data and display as HTML
router.get("/html", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM model");
    
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    console.log("Fetched rows:", rows);
    console.log("Fields:", fields);
    
    res.render("pages/Crudform", {
      title: "Model Details",
      fields: fields,
      rows: rows,
      table_name: "model",
      primary_key: "id",
    });
    
  } catch (err) {
    console.error("Error fetching model data:", err);
    res.status(500).json({ error: "Error fetching model data", details: err.message });
  }
});

// Route to fetch all model data (JSON format)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM model');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET model by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM model WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Model not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new model
router.post('/', async (req, res) => {
  const { date, type, last_trained_date, lstm_model, best_params } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO model (date, type, last_trained_date, lstm_model, best_params) VALUES (?, ?, ?, ?, ?)',
      [date, type, last_trained_date, JSON.stringify(lstm_model), JSON.stringify(best_params)]
    );
    res.status(201).json({ 
      id: result.insertId, 
      date, 
      type, 
      last_trained_date, 
      lstm_model, 
      best_params 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT/UPDATE model
router.put('/:id', async (req, res) => {
  const { date, type, last_trained_date, lstm_model, best_params } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE model SET date = ?, type = ?, last_trained_date = ?, lstm_model = ?, best_params = ? WHERE id = ?',
      [date, type, last_trained_date, JSON.stringify(lstm_model), JSON.stringify(best_params), req.params.id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Model not found' });
    } else {
      res.json({ 
        id: parseInt(req.params.id), 
        date, 
        type, 
        last_trained_date, 
        lstm_model, 
        best_params 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE model
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM model WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Model not found' });
    } else {
      res.json({ message: 'Model deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;