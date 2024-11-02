const OtomotoService = require("./services/scrapeServices/otomotoService");
const ScrapeService = require("./services/scrapeServices/scrapeService");

const otomotoService = new OtomotoService();
const scrapeService = new ScrapeService();

(async () => {
    try {
        const cars = await otomotoService.scrapePages(5);
        await scrapeService.scrape(cars, otomotoService.source);
    } catch (error) {
        console.error(`Error during scraping process: ${error.message}`);
    }
})();
