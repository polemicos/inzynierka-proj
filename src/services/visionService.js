const vision = require("@google-cloud/vision");

// Flexible regex to capture Polish car plate formats, with optional spaces or hyphens, and up to 8 characters
const regex = /^(?:[A-Z]{2,3}[-\s]?\d{4,5}[A-Z]?|[A-Z]{2,3}\s?[A-Z]{1,2}\s?\d{2,5}|[A-Z]{3}\s\d[A-Z]\d{2})$/;


function validateCarPlate(plate) {
    return regex.test(plate);
}

class VisionService {
    async detectPlate(images) {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: "./mythic-plexus-425612-j3-59f1eac834b5.json",
        });

        for (const image of images) {
            const request = {
                image: { source: { imageUri: image } },
            };

            try {
                const [result] = await client.textDetection(request);
                const labels = result.textAnnotations;

                if (labels.length === 0) {
                    console.log(`No text found in image ${image}`);
                    continue;
                }

                // Concatenate all detected text, replacing "-" with "".
                const allText = labels.map(label => label.description).join(' ').replace(/-/g, '');
                console.log(`Concatenated text for image ${image}: ${allText}`);

                const words = allText.split(/\s+/);

                // 1. Check each individual word for a valid plate format.
                for (const word of words) {
                    if (validateCarPlate(word)) {
                        console.log(`Valid plate found: ${word}`);
                        return word; // Return as soon as a valid plate is found
                    }
                }

                // 2. Check combinations of consecutive words if no single word was valid.
                for (let i = 0; i < words.length; i++) {
                    for (let j = i + 1; j <= words.length; j++) {
                        const joinedCombo = words.slice(i, j).join('');

                        if (validateCarPlate(joinedCombo)) {
                            console.log(`Valid plate found from combination: ${joinedCombo}`);
                            return joinedCombo; // Return as soon as a valid plate is found
                        }
                    }
                }

            } catch (error) {
                console.error(`Error detecting text in image ${image}:`, error.message);
            }
        }

        console.log("No valid plate found in any image.");
        return ''; // Return empty if no valid plate is found
    }
}

module.exports = VisionService;
