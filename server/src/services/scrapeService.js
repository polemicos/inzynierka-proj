const Car = require("../models/car");
const connectDB = require("../config/database");
const visionService = require("./visionService");
const { createOne } = require("../controllers/carController");
connectDB();

class ScrapeService {
    constructor() {
        this.visionService = new visionService();
    }

    async scrape(cars, source) {
        try {
            console.log(`Processing ${cars.length} cars.`);

            for (const carData of cars) {
                // Check if the car already exists
                const existingCarLink = await Car.findOne({ link: carData.link });
                if (existingCarLink) {
                    console.log(`Car already exists: ${carData.full_name}`);
                    continue; // Skip saving this car
                }

                const plate = await this.visionService.detectPlates(carData.photos_links);
                const existingCarPlate = await Car.findOne({ plate: plate });
                if (existingCarPlate) {
                    console.log(`Car already exists: ${carData.full_name}`);
                    continue;
                }
                const car = new Car({
                    source,
                    link: carData.link,
                    full_name: carData.full_name,
                    year: carData.year,
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
            console.error(`Failed to scrape cars: ${error.message}`);
        }
    }

}

module.exports = ScrapeService;
