const vision = require("@google-cloud/vision");

const quickstart = async () => {
    const client = new vision.ImageAnnotatorClient({
        keyFilename: "mythic-plexus-425612-j3-d40b82738c04.json",
    });

    const [result] = await client.textDetection('./1.jpg');
    const labels = result.textAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description.replaceAll(" ", "")));
};

module.exports = quickstart;
