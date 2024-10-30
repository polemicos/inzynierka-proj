const Car = require("../models/car");

async function findByPlate(plate) {
    try {
        const cars = await Car.find({ plate: { $regex: plate, $options: 'i' } });
        return cars;
    } catch (error) {
        console.error(`Error searching for cars: ${error.message}`);
    }
};

exports.findByPlate = findByPlate;