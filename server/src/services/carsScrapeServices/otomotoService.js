const CarScraperService = require("./carScraperService");
class OtomotoService extends CarScraperService {
    constructor() {
        super("https://www.otomoto.pl/osobowe", "Otomoto");
    }

    async extractCarsFromPage($) {
        const cars = [];
        const offers = $("article");

        const promises = offers.map(async (index, offer) => {
            try {
                const linkTag = $(offer).find("p").children("a");
                const link = linkTag.attr("href");
                const fullName = linkTag.text().trim();
                const year = $(offer).find("dl > dd[data-parameter='year']").text().trim() || "Unknown";
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
        return $("div[data-testid='photo-gallery-item']");
    }

    getBrand($) {
        const nav = $("nav");
        const carCategoryLi = nav.find("li:contains('Osobowe')");
        const brandLi = carCategoryLi.next("li");
        return brandLi.text().trim();
    }
}


module.exports = OtomotoService;
