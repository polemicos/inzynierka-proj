const connectDB = require("./config/database");
const Car = require("./models/car");

connectDB();

const deleteOldOffers = async () => {
    try {
        const oneDayAgo = new Date(Date.now() - 86400000);
        const offers = await Car.find({ created_at: { $lt: oneDayAgo } }, { link: 1 });
        if (offers.length > 0) {
            console.log(`Found ${offers.length} old offers to delete`);
            for (const offer of offers) {
                try {
                    const response = await fetch(offer.link);
                    if (!response.ok) {
                        console.log(`Deleting old offer: ${offer.link}`);
                        await Car.deleteOne({ link: offer.link });
                    }
                } catch (error) {
                    console.log("Error deleting old offer:", error)
                }
            }
        }
    } catch (error) {
        console.log("Error finding any old offers:", error)
    }
};

deleteOldOffers().then(() => {
});

