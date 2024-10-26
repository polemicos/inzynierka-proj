const vision = require("@google-cloud/vision");

const quickstart = async () => {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: process.env.VISION_AUTH_FILE,
    });

    const [result] = await client.textDetection('./1.jpg');
    const labels = result.textAnnotations;
    console.log('Text found:');
    labels.forEach(text => console.log(text.description.replaceAll(" ", "")));
};

module.exports = quickstart;
