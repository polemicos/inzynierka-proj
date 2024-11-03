const OtomotoService = require("./services/carsScrapeServices/otomotoService");
const OlxService = require("./services/carsScrapeServices/olxService");
const ScrapeService = require("./services/scrapeService");

const otomotoService = new OtomotoService();
const olxService = new OlxService();
const scrapeService = new ScrapeService();

while (true) {
    //Scrape 5 pages of each service immediately
    (async () => {
        try {
            const cars = await otomotoService.scrapePages(5);
            await scrapeService.scrape(cars, otomotoService.source);
            cars = await olxService.scrapePages(5);
            await scrapeService.scrape(cars, olxService.source);

        } catch (error) {
            console.error(`Error during scraping process: ${error.message}`);
        }
    })();
    // Wait for an hour
    await new Promise(resolve => setTimeout(resolve, 3600000));
}

