const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const carRoutes = require("./routes/carRoutes");
require("dotenv").config();

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", carRoutes);


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});