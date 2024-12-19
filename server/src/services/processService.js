const Car = require("../models/car");
const connectDB = require("../config/database");
const VisionService = require("./visionService");
const { createOne } = require("../controllers/carController");
connectDB();

class ProcessService {
    async processCars(cars, source) {
        try {
            console.log(`Processing ${cars.length} cars.`);
            for (const carData of cars) {
                const existingCarLink = await Car.findOne({ link: carData.link });
                if (existingCarLink) {
                    console.log(`Car already exists: ${carData.full_name}`);
                    continue;
                }
                if (carData.photos_links.length === 0) {
                    console.log(`No photos found for car: ${carData.full_name}`);
                    continue;
                }

                const plate = await VisionService.detectPlates(carData.photos_links);
                if (plate === "") {
                    console.log(`No plate found for car: ${carData.full_name}`);
                    continue;
                }
                const car = new Car({
                    source,
                    link: carData.link,
                    full_name: carData.full_name,
                    year: carData.year,
                    brand: carData.brand,
                    photos_links: carData.photos_links,
                    plate: plate,
                });

                try {
                    await createOne(car);
                    console.log(`Saved car: ${carData.full_name}`);
                } catch (dbError) {
                    console.error(`Error saving car ${carData.full_name}: ${dbError.message}`);
                }
            }
        } catch (error) {
            console.error(`Failed to process cars: ${error.message}`);
        }
    }

}

module.exports = ProcessService;
