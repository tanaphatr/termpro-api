const express = require('express');
const router = express.Router();
const pool = require('../../connect');

// Route to fetch history predictions and display as HTML
router.get("/html", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM history_predic");
    
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    console.log("Fetched rows:", rows);
    console.log("Fields:", fields);
    
    // // ลองใช้ generateHtmlPage แทน render ถ้ามีปัญหากับ template
    // const generateHtmlPage = require("../Tabletemplate.js");
    // const htmlContent = generateHtmlPage("History Predictions", fields, rows);
    // res.send(htmlContent);
    
    // หรือถ้าต้องการใช้ render ให้ uncomment บรรทัดด้านล่างนี้
    
    res.render("pages/Crudform", {
      title: "History Predictions",
      fields: fields,
      rows: rows,
      res: res,
      table_name: "history_predic",
      primary_key: "id",
    });
    
  } catch (err) {
    console.error("Error fetching history predictions:", err);
    res.status(500).json({ error: "Error fetching history predictions", details: err.message });
  }
});

// Route to fetch all history predictions (JSON format)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM history_predic');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET history prediction by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM history_predic WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'History prediction not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new history prediction
router.post('/', async (req, res) => {
  const { date, type, result } = req.body;
  try {
    const [result_query] = await pool.query(
      'INSERT INTO history_predic (date, type, result) VALUES (?, ?, ?)',
      [date, type, result]
    );
    res.status(201).json({ id: result_query.insertId, date, type, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT/UPDATE history prediction
router.put('/:id', async (req, res) => {
  const { date, type, result } = req.body;
  try {
    const [result_query] = await pool.query(
      'UPDATE history_predic SET date = ?, type = ?, result = ? WHERE id = ?',
      [date, type, result, req.params.id]
    );
    if (result_query.affectedRows === 0) {
      res.status(404).json({ message: 'History prediction not found' });
    } else {
      res.json({ id: parseInt(req.params.id), date, type, result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE history prediction
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM history_predic WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'History prediction not found' });
    } else {
      res.json({ message: 'History prediction deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;