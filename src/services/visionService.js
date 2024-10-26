const vision = require("@google-cloud/vision");

// Updated regex for validating Polish car plate numbers
const regex = /^(?:[A-Z]{3}\d{5}|[A-Z]{2,3}\d{4}[A-Z]?)$/; // Polish plate format

function validateCarPlate(plate) {
    return regex.test(plate);
}

class VisionService {
    async detectPlate(images) {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: "./mythic-plexus-425612-j3-59f1eac834b5.json",
        });

        let plate = ''; // Variable to store the last valid plate detected

        for (const image of images) {
            // Prepare the request object for the Vision API
            const request = {
                image: { source: { imageUri: image } },
            };

            try {
                // Perform text detection on the image URL
                const [result] = await client.textDetection(request);
                const labels = result.textAnnotations;

                console.log(`Text found in image ${image}:`);

                labels.forEach((text) => {
                    // Clean the text: trim whitespace
                    const cleanedText = text.description.trim();
                    console.log(`Detected text: ${cleanedText}`); // Log detected text

                    // Split the text into parts
                    const parts = cleanedText.split(/\s+/); // Split on whitespace
                    const concatenatedParts = parts.join('').replaceAll("-", ""); // Concatenate parts without hyphens

                    // Validate concatenated version
                    if (validateCarPlate(concatenatedParts)) {
                        plate = concatenatedParts; // Assign if valid
                    }

                    // Check individual parts
                    parts.forEach(part => {
                        const cleanedPart = part.replaceAll("-", "").trim(); // Clean hyphens
                        if (validateCarPlate(cleanedPart)) {
                            plate = cleanedPart; // Assign if valid
                        }
                    });
                });
            } catch (error) {
                console.error(`Error detecting text in image ${image}:`, error.message);
            }
        }

        console.log(`Last valid plate: ${plate}`);
        return plate; // Return the last valid plate found
    }
}


module.exports = VisionService;
