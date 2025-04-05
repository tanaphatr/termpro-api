// app.js
const express = require("express");
const cors = require("cors");

const mainRoutes = require("./Route/Main"); // Use consistent naming convention
const ProductsRoutes = require("./Route/Table/Products");
const ModelRoutes= require("./Route/Table/Model");
const EmployeesRoutes = require("./Route/Table/Employees");
const Product_sales= require("./Route/Table/Product_sales");
const Salesdata = require("./Route/Table/Salesdata");
const historyPredicRouter = require('./Route/Table/History_predic');
const GoodsaleproductData = require('./Route/Table/GoodsaleproductData');
const GraphPie = require('./Route/Table/GraphPie');

const app = express();
const path = require("path"); // เรียกใช้งาน path module
const hostname = "http://localhost";
const port = 8888;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all requests

// Main Server
app.use("/", mainRoutes);
// Use routes from the new files

app.use("/Products", ProductsRoutes);
app.use("/Employees", EmployeesRoutes);

app.use("/Product_sales", Product_sales);


app.use("/Salesdata", Salesdata);
app.use("/Model", ModelRoutes);

app.use('/History_predic', historyPredicRouter);
app.use('/GoodsaleproductData', GoodsaleproductData);
app.use('/GraphPie', GraphPie);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server is running on \x1b[31m${hostname}:${port}\x1b[0m`);
});
