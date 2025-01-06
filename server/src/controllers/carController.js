const Car = require("../models/car");

async function findByPlate(plate) {
    try {
        const cars = await Car.find({ plate: { $regex: plate, $options: 'i' } });
        return cars;
    } catch (error) {
        console.error(`Error searching for cars: ${error.message}`);
    }
};

async function findByBrand(brand) {
    try {
        const cars = await Car.find({ brand: { $regex: brand, $options: 'i' } });
        return cars;
    } catch (error) {
        console.error(`Error searching for cars: ${error.message}`);
    }
};

async function createOne(car) {
    try {
        await car.save();
        return car;
    } catch (error) {
        console.error(`Error creating car: ${error.message}`);
    }
}

async function deleteOne(link) {
    try {
        await Car.deleteOne({ link });
    } catch (error) {
        console.error(`Error deleting car: ${error.message}`);
    }
}

module.exports = {
    findByPlate,
    findByBrand,
    createOne,
    deleteOne
}