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
                const linkTag = $(offer).find("h2").children("a");
                const link = linkTag.attr("href");
                const fullName = $(offer).find("h2").text().trim();
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
        return $("div[data-testid='photo-gallery']");
    }

    getBrand($) {
        const nav = $("nav");
        const carCategoryLi = nav.find('li:contains("Osobowe")');
        const brandLi = carCategoryLi.next("li");
        //console.log(brandLi.attr("title"));
        return brandLi.attr("title")==undefined? "Unknown" : brandLi.attr("title");
    }
}


module.exports = OtomotoService;
