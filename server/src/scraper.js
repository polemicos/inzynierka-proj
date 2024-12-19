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
            console.log(`\t\t\tStarting ${service.source} scraping...\t\t\t`);
            service.scrapePages(pagesToScrape).then((cars) => {
                resolve(cars);
            })

        }
        catch (error) {
            console.error(`Error during ${service.source} scraping: ${error.message}`);
            throw error;
        }
    }).then((cars) => {
        return processService.processCars(cars, service.source);
    });

}

const main = async () => {
    while (true) {
        try {
            await scrapeAndProcess(otomotoService);
            await scrapeAndProcess(olxService);

            console.log("Waiting for an hour...");
            await new Promise(resolve => setTimeout(resolve, 3600000));
        } catch (error) {
            console.error(`Unexpected error in the loop: ${error.message}`);
        }
    }
};

main();
