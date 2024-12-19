const CarScraperService = require("./carScraperService");

class OlxService extends CarScraperService {
    constructor() {
        super("https://www.olx.pl/motoryzacja/samochody", "OLX");
    }

    async extractCarsFromPage($) {
        const cars = [];
        const offers = $("div[data-testid='l-card']");

        const promises = offers.map(async (index, offer) => {
            try {
                const linkTag = $(offer).find("div[data-cy='ad-card-title'] > a");
                let link = linkTag.attr("href");
                link.startsWith("https")? link : link = "https://www.olx.pl" + link;
                const fullName = $(linkTag).find("h4").text().trim();
                const year = $(offer).find("span > span").text().trim() || "Unknown";
                const [photos, brand] = await this.extractPhotosAndBrandFromOfferPage(link);
                cars.push({ link: link, full_name: fullName, year, brand, photos_links: photos });
            } catch (err) {
                console.error(`Error extracting car data: ${err.message}`);
            }
        });

        await Promise.all(promises);
        return cars;
    }

    getPhotoDivs($) {
        return $("div[class='swiper-zoom-container']");
    }

    getBrand($) {
        const nav = $("nav");
        const carCategoryLi = nav.find("li:contains('Samochody osobowe')");
        const brandLi = carCategoryLi.next("li");
        return brandLi.text().trim();
    }

}

module.exports = OlxService;