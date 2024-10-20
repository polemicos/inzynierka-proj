const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    link: String,
    full_name: String,
    year: Number,
    mileage_km: String,
    gearbox: String,
    fuel_type: String,
    price_pln: Number,
    photo_link: String,
    plate: String,
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
