const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    source: { type: String, required: true },
    link: { type: String, required: true },
    full_name: { type: String, required: true },
    year: { type: String, required: true },
    photos_links: { type: [String], required: true },
    plate: { type: String },
    created_at: { type: Date, default: Date.now },
});

const Car = mongoose.model("Car", carSchema, "cars");

module.exports = Car;
