const vision = require("@google-cloud/vision");
require('dotenv').config();
const regex = /^(?:[A-Z]{2,3}[-\s]?\d{4,5}[A-Z]?|[A-Z]{2,3}\s?[A-Z]{1,2}\s?\d{2,5}|[A-Z]{3}\s\d[A-Z]\d{2})$/;
const regex3let = /\b(?:BAU|BIA|BBI|BGR|BHA|BKL|BMN|BSE|BSI|BSK|BSU|BCH|BWM|BZA|BLM|CAL|CBR|CBY|CCH|CGD|CGR|CIN|CLI|CMG|CNA|CRA|CRY|CSE|CSW|CTR|CTU|CWA|CWL|CZN|DBL|DDZ|DGR|DGL|DJA|DJE|DKA|DKL|DLE|DLB|DLU|DLW|DMI|DOL|DOA|DPL|DSR|DST|DSW|DTR|DBA|DWL|DWR|DZA|DZG|DZL|EBE|EBR|EKU|EOP|EPA|EPJ|EPI|EPD|ERA|ERW|ESI|ESK|ETM|EWI|EWE|EZD|EZG|ELA|ELE|ELW|ELC|FGW|FKR|FMI|FNW|FSD|FSU|FSW|FSL|FWS|FZG|FZA|FZI|GBY|GCH|GCZ|GDA|GKA|GKS|GKW|GLE|GMB|GMO|GND|GPU|GST|GSZ|GSL|GTC|GWE|GWO|KBC|KBA|KBR|KCH|KDA|KGR|KRA|KLI|KMI|KMY|KNS|KNT|KOL|KOS|KPR|KSU|KTA|KTT|KWA|KWI|LBI|LBL|LCH|LHR|LJA|LKR|LKS|LLB|LUB|LOP|LPA|LPU|LRA|LRY|LSW|LTM|LWL|LZA|LLE|LLU|NBA|NBR|NDZ|NEB|NEL|NGI|NGO|NIL|NKE|NLI|NMR|NNI|NNM|NOE|NOL|NOS|NPI|NSZ|NWE|OBR|OGL|OKL|OKR|ONA|ONY|OOL|OPO|OPR|OST|PCH|PCT|PGN|PGS|PGO|PJA|PKA|PKE|PKL|PKN|PKS|PKR|PLE|PMI|PNT|POB|POS|POT|PPL|PZL|PRA|PSR|PSE|PSZ|PSL|PTU|PWA|PWL|PWR|PZL|RBI|RBR|RDE|RJA|RJS|RKL|RKR|RLS|RLE|RLU|RMI|RNI|RPR|RPZ|RRS|RZE|RSA|RST|RSR|RTA|RLA|SBE|SBI|SBL|SCI|SCZ|SGL|SKL|SLU|SMI|SMY|SPS|SRC|SRB|STA|SWD|SWZ|SZA|SZY|TBU|TJE|TKA|TKI|TKN|TOP|TOS|TPI|TSA|TSK|TST|TSZ|TLW|WBR|WCI|WG|WGS|WGM|WGR|WKZ|WL|WLI|WMA|WM|WML|WND|WOR|WOS|WOT|WPI|WPR|WPP|WPS|WPZ|WPY|WPU|WPL|WPN|WRA|WSI|WSE|WSC|WSK|WSZ|WZ|WWE|WWL|WV|WWY|WZU|WZW|WZY|WLS|ZBI|ZCH|ZDR|ZGL|ZGY|ZGR|ZKA|ZKO|ZKL|ZMY|ZPL|ZPY|ZST|ZSD|ZSZ|ZMK|ZSM|ZRZ|ZDC|ZSL|ZWA|ZLO)\b/
const regex2let = /\b(?:BI|BS|BL|CB|CG|CT|CW|DJ|DL|DB|DW|EP|ES|EL|FG|FZ|GD|GA|GSP|GS|KR|KK|KN|KT|LB|LC|LU|LZ|NE|NO|OP|PK|PN|PL|PO|PY|RK|RP|RZ|RT|SB|SY|SH|SC|SD|SG|SJZ|SJ|SK|SM|SPI|SL|SR|SI|SO|SW|ST|SZ|SZO|TK|WO|WA|WE|WP|WI|WR|WS|ZK|ZP|ZG|ZD|SZ|SZM|ZP|ZSW|ZS|ZZ|XD)\b/
const regex4_5 = /\b(?![a-zA-Z]{4,5}\b)\w{4,5}\b/;
const regex5 = /\b(?![a-zA-Z]{5}\b)\w{5}\b/;

class VisionService {

    static validateCarPlate(plate) {
        return plate.length <= 8 && plate.length >= 7 && regex.test(plate);
    }

    static calculateBoundingBoxArea(boundingPoly) {
        const [p1, , p3] = boundingPoly.vertices;
        return Math.abs((p3.x - p1.x) * (p3.y - p1.y));
    }

    static async detectPlates(images, mode = 0) {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: process.env.VISION_AUTH_JSON,
        });

        let potentialPlates = [];
        for (const image of images) {
            console.log("Processing image: ", image);
            let request;
            if (mode === 0) {
                request = { image: { source: { imageUri: image } } };
            } else if (mode === 1) {
                const base64Image = image.toString("base64");
                request = { image: { content: base64Image } };
            }
            try {
                const [result] = await client.textDetection(request);
                const labels = result.textAnnotations;
                
                if (labels.length === 0) {
                    continue;
                }
                
                const allText = labels.map(label => label.description).join(' ').replace(/-/g, '');
                console.log(`Concatenated text for image: ${allText}`);
                const words = allText.split(/\s+/);
                for (let i = 0; i < words.length - 1; i++) {
                    if (regex3let.test(words[i]) && regex4_5.test(words[i + 1])) {
                        const plate = `${words[i]}${words[i + 1]}`;
                        labels[i] && labels[i + 1] && labels[i].boundingPoly && labels[i + 1].boundingPoly ?
                            potentialPlates.push({ plate, area: this.calculateBoundingBoxArea(labels[i].boundingPoly) + this.calculateBoundingBoxArea(labels[i + 1].boundingPoly) })
                            : potentialPlates.push({ plate });

                    } else if (regex2let.test(words[i]) && regex5.test(words[i + 1])) {
                        const plate = `${words[i]}${words[i + 1]}`;
                        labels[i] && labels[i + 1] && labels[i].boundingPoly && labels[i + 1].boundingPoly ?
                            potentialPlates.push({ plate, area: this.calculateBoundingBoxArea(labels[i].boundingPoly) + this.calculateBoundingBoxArea(labels[i + 1].boundingPoly) })
                            : potentialPlates.push({ plate });
                    }
                }

                for (const word of words) {
                    if (this.validateCarPlate(word)) {
                        word.boundingPoly ?
                            potentialPlates.push({ plate: word, area: this.calculateBoundingBoxArea(word.boundingPoly) })
                            : potentialPlates.push({ plate: word });
                    }
                }
                console.log(`Potential plates for this offer:\n`, potentialPlates);
            }

            catch (error) {
                console.error(`Error detecting text in image:`, error.message);
            }

        }
        if (mode === 0 && potentialPlates.length > 0) {
            // Filter out plates that have an area defined
            const platesWithArea = potentialPlates.filter(plate => plate.area !== undefined);

            let selectedPlate;
            if (platesWithArea.length > 1) {
                // If more than one plate has an area, choose the one with the largest area
                selectedPlate = platesWithArea.reduce((max, current) => (current.area > max.area ? current : max)).plate;
            } else if (platesWithArea.length === 1) {
                // If only one plate has an area, select it directly
                selectedPlate = platesWithArea[0].plate;
            } else {
                // If no plates have an area, select the plate with the longest length
                selectedPlate = potentialPlates.reduce((longest, current) => (current.plate.length > longest.plate.length ? current : longest)).plate;
            }

            console.log(`Selected plate: ${selectedPlate}`);
            return selectedPlate;
        }
        if (mode === 1 && potentialPlates.length > 0) {
            potentialPlates = potentialPlates.map(plate => plate.plate);
            const unique = new Set(potentialPlates);
            return Array.from(unique);
        }
        else {
            console.log("No valid plate found in any image.");
            return '';
        }
    }
}
module.exports = VisionService;
