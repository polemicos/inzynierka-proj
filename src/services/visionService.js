const vision = require("@google-cloud/vision");

const quickstart = async () => {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: process.env.VISION_AUTH_FILE,
    });

    const [result] = await client.textDetection('./1.jpg');
    const labels = result.textAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description.replaceAll(" ", "")));
};

module.exports = quickstart;
