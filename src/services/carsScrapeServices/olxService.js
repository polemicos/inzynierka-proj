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
                const link = linkTag.attr("href");
                const fullName = $(linkTag).find("h6").text().trim();
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
        return $("div[class='swiper-zoom-container']");
    }
}

module.exports = OlxService;