import fs from "fs";
import moment from "moment";
import PDFDocument from "pdfkit";
import { BASE_URL } from "../config/secrets.js";
import { createCanvas, loadImage } from "canvas";
export const certificationGenerator = (name) => {
    console.log(name);
    const now = Date.now();
    try {
        // Create the PDF document
        const doc = new PDFDocument({
            layout: "landscape",
            size: "A4",
        });
        // Pipe the PDF into a name.pdf file
        doc.pipe(fs.createWriteStream(`./public/cetrifications/${name}-certificate-${now}.pdf`));
        // Draw the certificate image
        doc.image("src/template/certificate.png", 0, 0, { width: 842 });
        // // Remember to download the font
        // // Set the font to Dancing Script
        doc.font("src/template/fonts/DancingScript-VariableFont_wght.ttf");
        // // Draw the name
        doc.fontSize(60).text(name, 20, 265, {
            align: "center",
        });
        // Draw the date
        doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -275, 430, {
            align: "center",
        });
        // Finalize the PDF and end the stream
        doc.end();
        return { success: true, path: `${BASE_URL}cetrifications/${name}-certificate-${now}.pdf` };
    }
    catch (error) {
        console.log(error);
    }
    return { success: false, path: "" };
};
export const certificationGeneratorImage = async (name) => {
    const now = Date.now();
    try {
        // Load the certificate image
        const image = await loadImage("src/template/certificate.png");
        // Create a canvas with the same dimensions as the image
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        // Draw the certificate image onto the canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);
        // Set the font and style
        ctx.font = "60px Dancing Script";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        // Draw the name
        ctx.fillText(name, canvas.width / 2, 265);
        // Set the font and style for the date
        ctx.font = "17px Dancing Script";
        ctx.fillStyle = "#000000";
        // Draw the date
        ctx.fillText(moment().format("MMMM Do YYYY"), canvas.width / 2, 430);
        // Convert the canvas to a JPEG buffer
        const jpegBuffer = canvas.toBuffer("image/jpeg");
        // Write the JPEG buffer to a file
        const filePath = `./public/certifications/${name}-certificate-${now}.jpg`;
        fs.writeFileSync(filePath, jpegBuffer);
        return { success: true, path: `${BASE_URL}certifications/${name}-certificate-${now}.jpg` };
    }
    catch (error) {
        console.log(error);
    }
    return { success: false, path: "" };
};
