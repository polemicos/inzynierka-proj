const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const carRoutes = require("./routes/carRoutes");
const indexRoutes = require("./routes/indexRoutes");
require("dotenv").config();

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/car", carRoutes);
app.use("/", indexRoutes);


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





