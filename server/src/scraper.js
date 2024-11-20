const OtomotoService = require("./services/carsScrapeServices/otomotoService");
const OlxService = require("./services/carsScrapeServices/olxService");
const ProcessService = require("./services/processService");

const otomotoService = new OtomotoService();
const olxService = new OlxService();

const processService = new ProcessService();
const pagesToScrape = 5;

async function scrapeAndProcess(service) {
    await new Promise((resolve, reject) => {
        try {
            console.log(`Starting ${service.source} scraping...`);
            service.scrapePages(pagesToScrape).then((cars) => {
                resolve(cars);
            })

        }
        catch (error) {
            console.error(`Error during ${service.source} scraping: ${error.message}`);
            throw error;  // Rethrow error to be handled in the main loop
        }
    }).then((cars) => {
        return processService.processCars(cars, service.source);
    });

}

const main = async () => {
    while (true) {
        try {
            // Sequentially call scrapeAndProcess for each service
            await scrapeAndProcess(otomotoService);  // This waits for Otomoto to finish scraping and processing
            await scrapeAndProcess(olxService);      // This waits for OLX to finish scraping and processing

            console.log("Waiting for an hour...");
            await new Promise(resolve => setTimeout(resolve, 3600000));  // 1-hour delay
        } catch (error) {
            console.error(`Unexpected error in the loop: ${error.message}`);
        }
    }
};

main();
