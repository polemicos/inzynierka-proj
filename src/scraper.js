const OtomotoService = require("./services/carsScrapeServices/otomotoService");
const OlxService = require("./services/carsScrapeServices/olxService");
const ScrapeService = require("./services/scrapeService");

const otomotoService = new OtomotoService();
const olxService = new OlxService();
const scrapeService = new ScrapeService();

(async () => {
    while (true) {
        try {
            console.log("Starting OTOMOTO scraping...");
            const cars = await otomotoService.scrapePages(5);
            await scrapeService.scrape(cars, otomotoService.source);

            console.log("Starting OLX scraping...");
            cars = await olxService.scrapePages(5);
            await scrapeService.scrape(cars, olxService.source);

            console.log("OLX scraping completed. Waiting for an hour...");
        } catch (error) {
            console.error(`Error during scraping process: ${error.message}`);
        }

        // Wait for an hour
        await new Promise(resolve => setTimeout(resolve, 3600000));
    }
})();
