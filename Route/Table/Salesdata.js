const express = require("express");
const router = express.Router();
const db = require("../../connect.js");
const generateHtmlPage = require("../Tabletemplate.js");
const fetch = require("node-fetch");

const apiKey = "9f04441fb1254c3a8bf212302242009"; // Replace with your actual API key

// Route to fetch Salesdata and display as HTML
router.get("/html", async (req, res) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM Salesdata");
    res.send(generateHtmlPage("Data of Pro", fields, rows));
  } catch (err) {
    console.error("Error fetching Salesdata:", err);
    res.status(500).json({ error: "Error fetching Salesdata" });
  }
});
    
// Route to fetch all Salesdata (JSON format)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Salesdata");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching Salesdata:", err);
    res.status(500).json({ error: "Error fetching Salesdata" });
  }
});

// Route to add a new Salesdata record (POST)
router.post("/", async (req, res) => {
  const { sale_date, sales_amount, profit_amount } = req.body;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Bangkok&days=2`
    );
    const weatherData = await response.json();
    const Temperature = weatherData.forecast.forecastday[0].day.avgtemp_c;

    const result = await db.query(
      "INSERT INTO Salesdata (sale_date, sales_amount, profit_amount, Temperature) VALUES (?, ?, ?, ?)",
      [sale_date, sales_amount || null, profit_amount || null, Temperature]
    );

    res.status(201).json({
      id: result.insertId,
      sale_date,
      sales_amount,
      profit_amount,
      Temperature,
    });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).json({ error: "Error adding record" });
  }
});

// Route to update a Salesdata record (PUT)
router.put("/:sales_data_id", async (req, res) => {
  const { sales_data_id } = req.params;
  const { sales_amount, profit_amount, weather, Temperature } = req.body;

  try {
    const result = await db.query(
      "UPDATE Salesdata SET sales_amount = ?, profit_amount = ?,  weather = ?, Temperature = ? WHERE sales_data_id = ?",
      [
        sales_amount || null,
        profit_amount || null,
        weather,
        Temperature,
        sales_data_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json({
      message: "Record updated successfully",
      sales_data_id,
      sales_amount,
      profit_amount,
      weather,
      Temperature,
    });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:sales_data_id", async (req, res) => {
  try {
    const { sales_data_id } = req.params;
    if (!sales_data_id) {
      return res.status(400).json({ error: "Sales data ID is required" });
    }

    console.log("Deleting Salesdata ID:", sales_data_id);

    const [result] = await db.query(
      "DELETE FROM Salesdata WHERE sales_data_id = ?",
      [sales_data_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Salesdata record not found" });
    }

    res.status(200).json({ message: "Salesdata record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

module.exports = router;
