const OtomotoService = require("./otomotoService");
const Car = require("../../models/car");
const connectDB = require("../../config/database");

connectDB();

class ScrapeService {
    constructor() {
        this.otomoto = new OtomotoService();
    }

    async scrape() {
        try {
            const cars = await this.otomoto.scrapePages(3);
            console.log(`Scraped ${cars.length} cars.`);

            for (const carData of cars) {
                // Check if the car already exists
                const existingCar = await Car.findOne({ link: carData.link });
                if (existingCar) {
                    console.log(`Car already exists: ${carData.full_name}`);
                    continue; // Skip saving this car
                }

                const car = new Car({
                    link: carData.link,
                    full_name: carData.full_name,
                    year: carData.year,
                    photos_links: carData.photos_links,
                    plate: null,  // Or any logic to set the plate
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


    async scrapeAndSave(cars) {
        try {
            // Scrape car data from Otomoto
            console.log(`Scraped ${cars.length} cars.`);

            // Save each car to the database
            for (const carData of cars) {
                const car = new Car({
                    link: carData.link,
                    full_name: carData.full_name,
                    year: carData.year,
                    photos_links: carData.photos_links,
                    plate: null  // You can set this to a specific value if available
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
const scrape = new ScrapeService();
scrape.scrape();

module.exports = ScrapeService;
