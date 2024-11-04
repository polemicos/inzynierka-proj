const express = require("express");
const Car = require("../models/car");
const router = express.Router();

// Route to get all cars with pagination
router.get("/carplates", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 10 cars per page

    try {
        const cars = await Car.aggregate([{ $sample: { size: limit } }]); // Replace with sample query for demo
        const totalCars = await Car.countDocuments();
        const totalPages = Math.ceil(totalCars / limit);

        res.render("cars", {
            list: cars,
            currentPage: page,
            totalPages,
            limit,
        });
    } catch (err) {
        console.error("Error fetching data from database: ", err);
        res.render("cars", { list: [], currentPage: 1, totalPages: 1 });
    }
});


module.exports = router;
