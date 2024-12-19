const express = require("express");
const Car = require("../models/car");
const router = express.Router();
const carController = require("../controllers/carController");
const VisionService = require("../services/visionService");
const multer = require("multer");
const upload = multer();

// Route to get all cars with pagination
router.get("/cars", async (req, res) => {

    try {
        const cars = await Car.find({});
        res.json(
            {
                list: cars,
            }
        )
    } catch (err) {
        console.error("Error fetching data from database: ", err);
        res.json(
            {
                list: [],
            }
        )
    }
});

// Route to get cars by plate
router.get("/search/plate/:plate", async (req, res) => {
    console.log(req.params.plate);
    const plate = req.params.plate;
    const data = await carController.findByPlate(plate);
    res.json(data);
});

// Route to get cars by brand
router.get("/search/brand/:brand", async (req, res) => {
    console.log(req.params.brand);
    const brand = req.params.brand;
    const data = await carController.findByBrand(brand);
    res.json(data);
});

// Route to detect plates from provided images
router.post("/detect", upload.single("img"), async (req, res) => {
    const img = req.file.buffer;
    const data = await VisionService.detectPlates([img], 1);
    res.json(data);
})

module.exports = router;
