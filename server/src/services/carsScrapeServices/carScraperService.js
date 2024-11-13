require('dotenv').config();
const axios = require("axios");
const cheerio = require("cheerio");

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/90.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
];

// Base class
class CarScraperService {
    constructor(baseURL, source) {
        this.baseURL = baseURL;
        this.source = source;
    }

    getRandomUserAgent() {
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    async scrapePages(numberOfPages) {
        const cars = [];
        for (let i = 1; i <= numberOfPages; i++) {
            const pageURL = `${this.baseURL}?page=${i}`;
            const newCars = await this.scrapeCarsFromPage(pageURL);
            cars.push(...newCars);
        }
        return cars;
    }

    async scrapeCarsFromPage(url) {
        try {
            const headers = {
                "User-Agent": this.getRandomUserAgent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            };

            const response = await axios.get(url, { headers });
            if (response.status === 403) throw new Error("403 Forbidden");

            const $ = cheerio.load(response.data);
            const cars = await this.extractCarsFromPage($);
            return cars;
        } catch (err) {
            console.error(`Failed to scrape ${url}: ${err.message}`);
            return [];
        }
    }

    getBrand($) {
        throw new Error("Method 'getBrand' must be implemented in the subclass");
    }

    async extractCarsFromPage($) {
        throw new Error("Method 'extractCarsFromPage' must be implemented in the subclass");
    }

    async extractPhotosAndBrandFromOfferPage(offerUrl) {
        const photos = [];
        let brand = "";
        try {
            const headers = {
                "User-Agent": this.getRandomUserAgent(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Connection": "keep-alive",
            };

            const response = await axios.get(offerUrl, { headers });
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                let photoDivs = this.getPhotoDivs($);
                brand = this.getBrand($);

                photoDivs.each((index, element) => {
                    if (photos.length > 6) return false;
                    const imgTag = $(element).find("img");
                    const url = imgTag.attr("src");
                    if (url) photos.push(url);
                });
            } else if (response.status === 403) {
                console.log(`403 Forbidden on: ${offerUrl}`);
            }
        } catch (err) {
            console.error(`Failed to scrape photos from ${offerUrl}: ${err.message}`);
        }

        return [photos, brand];
    }

    getPhotoDivs($) {
        throw new Error("Method 'getPhotoDivs' must be implemented in the subclass");
    }
}
module.exports = CarScraperService;