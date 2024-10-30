const Car = require("../../models/car");
const connectDB = require("../../config/database");
const visionService = require("../visionService");
connectDB();

class ScrapeService {
    constructor() {
        this.visionService = new visionService();
    }

    async scrape(cars) {
        try {
            console.log(`Processing ${cars.length} cars.`);

            for (const carData of cars) {
                // Check if the car already exists
                const existingCar = await Car.findOne({ link: carData.link });
                if (existingCar) {
                    console.log(`Car already exists: ${carData.full_name}`);
                    continue; // Skip saving this car
                }

                const plate = await this.visionService.detectPlates(carData.photos_links);
                const car = new Car({
                    link: carData.link,
                    full_name: carData.full_name,
                    year: carData.year,
                    photos_links: carData.photos_links,
                    plate: plate,
                });

                try {
                    await car.save();
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
