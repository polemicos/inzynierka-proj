const express = require('express');
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const carRoutes = require("./routes/carRoutes");
const indexRoutes = require("./routes/indexRoutes");

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("./src/public"));
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/cars", carRoutes);
app.use("/", indexRoutes);


// Server setup
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





