const connectDB = require("./config/database");
const Car = require("./models/car");
const axios = require("axios");

connectDB();

const deleteOldOffers = async () => {
    try {
        const oneDayAgo = new Date(Date.now() - 86400000); // One day ago date
        const offers = await Car.find({ created_at: { $lt: oneDayAgo } }, { link: 1 });

        if (offers.length > 0) {
            console.log(`Found ${offers.length} old offers to check and delete if unavailable`);

            const results = await Promise.all(
                offers.map(async (offer) => {
                    try {
                        const response = await axios.get(offer.link, { timeout: 5000 });

                        if (response.status !== 200) {
                            console.log(`Deleting old offer: ${offer.link}`);
                            await Car.deleteOne({ link: offer.link });
                        }
                    } catch (error) {
                        if (error.response && error.response.status) {
                            console.log(`Deleting old offer (status ${error.response.status}): ${offer.link}`);
                            await Car.deleteOne({ link: offer.link });
                        } else {
                            console.error(`Error while checking/deleting offer ${offer.link}:`, error.message);
                        }
                    }
                })
            );

            console.log("Finished checking and deleting old offers.");
        } else {
            console.log("No old offers found to delete.");
        }
    } catch (error) {
        console.error("Error finding old offers:", error.message);
    }
};

deleteOldOffers()
    .then(() => {
        console.log("Old offers cleanup complete.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Unexpected error:", error.message);
        process.exit(1);
    });
