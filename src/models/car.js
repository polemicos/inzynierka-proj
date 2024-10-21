const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    link: { type: String, required: true },
    full_name: { type: String, required: true },
    year: { type: String, required: true },
    photos_links: { type: [String], required: true },
    plate: { type: String }
});

const Car = mongoose.model("Car", carSchema, "otomoto_cars");

module.exports = Car;
