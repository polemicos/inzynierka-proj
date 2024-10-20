const express = require('express');
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const carRoutes = require("./routes/carRoutes");
const indexRoutes = require("./routes/indexRoutes");
const visionService = require("./services/visionService");

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", __dirname + "\\views");
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/", indexRoutes);
app.use("/", carRoutes);

// Start Google Vision service
visionService();

// Server setup
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



//REGEX FOR CAR PLATE
// const regex = /^[A-Z]{2,3}[- ]?[0-9A-Z]{4,5}$/;

// function validateCarPlate(plate) {
//     return regex.test(plate);
// }

// // Example usage:
// console.log(validateCarPlate('WZ 1234A')); // true
// console.log(validateCarPlate('PO-2345')); // true
// console.log(validateCarPlate('KRA56789')); // true
// console.log(validateCarPlate('AA 12345')); // false (invalid format)
