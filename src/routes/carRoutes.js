const express = require("express");
const Car = require("../models/car");
const router = express.Router();

// Route to get all cars
router.get("/carplates", async (req, res) => {
    try {
        const cars = await Car.aggregate([{ $sample: { size: 30 } }]);
        console.log(cars);
        res.render("cplist", {
            list: cars,
        });
    } catch (err) {
        console.error("Error fetching data from database: ", err);
    }
});

// Route to get car by id
router.get("/carplates/:id", (req, res) => {
    res.send("Carplate number: " + req.params.id);
});

module.exports = router;
