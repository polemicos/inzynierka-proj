class OtomotoService extends CarScraperService {
    constructor() {
        super("https://www.otomoto.pl/osobowe", "Otomoto");
    }

    async extractCarsFromPage($) {
        const cars = [];
        const offers = $("article");

        const promises = offers.map(async (index, offer) => {
            try {
                const linkTag = $(offer).find("h1 > a");
                const link = linkTag.attr("href");
                const fullName = linkTag.text().trim();
                const year = $(offer).find("dl > dd[data-parameter='year']").text().trim() || "Unknown";
                const photos = await this.extractPhotosFromOfferPage(link);
                cars.push({ link: link, full_name: fullName, year, photos_links: photos });
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
}


module.exports = OtomotoService;
