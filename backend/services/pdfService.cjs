const {
    PDFDocument,
    StandardFonts,
    rgb
} = require("pdf-lib");

async function generateCertificatePDF(certificate) {
    try {
        const pdfDoc = await PDFDocument.create();

        const page = pdfDoc.addPage([842, 595]); // A4 landscape

        const {
            studentName,
            course,
            programCode,
            certificateNumber,
            completionDate,
            issueDate,
            status,
            qrData
        } = certificate;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const { width, height } = page.getSize();

        // Border
        page.drawRectangle({
            x: 20,
            y: 20,
            width: width - 40,
            height: height - 40,
            borderWidth: 3,
            borderColor: rgb(0.1, 0.2, 0.4)
        });

        // Title
        page.drawText("UP SKILLS HUB", {
            x: 300,
            y: 510,
            size: 28,
            font: boldFont,
            color: rgb(0.1, 0.2, 0.4)
        });

        page.drawText("CERTIFICATE OF COMPLETION", {
            x: 260,
            y: 465,
            size: 22,
            font: boldFont
        });

        page.drawText("This certificate is proudly presented to", {
            x: 290,
            y: 420,
            size: 14,
            font
        });

        // Student name
        page.drawText(studentName, {
            x: 250,
            y: 375,
            size: 30,
            font: boldFont
        });

        page.drawText("For successfully completing", {
            x: 315,
            y: 330,
            size: 14,
            font
        });

        // Course
        page.drawText(course, {
            x: 300,
            y: 295,
            size: 22,
            font: boldFont
        });

        page.drawText(`Program Code: ${programCode}`, {
            x: 330,
            y: 255,
            size: 12,
            font
        });

        page.drawText(`Certificate Number: ${certificateNumber}`, {
            x: 300,
            y: 220,
            size: 12,
            font
        });

        page.drawText(`Completion Date: ${completionDate}`, {
            x: 300,
            y: 190,
            size: 12,
            font
        });

        page.drawText(`Issue Date: ${issueDate || "N/A"}`, {
            x: 300,
            y: 165,
            size: 12,
            font
        });

        page.drawText(`Status: ${status || "Valid"}`, {
            x: 300,
            y: 140,
            size: 12,
            font
        });

        page.drawText(
            "Scan the QR code to verify this certificate.",
            {
                x: 560,
                y: 100,
                size: 10,
                font
            }
        );

        // QR code
        if (qrData) {
            const qrBase64 = qrData.split(",")[1];
            const qrBytes = Buffer.from(qrBase64, "base64");

            const qrImage = await pdfDoc.embedPng(qrBytes);

            page.drawImage(qrImage, {
                x: 600,
                y: 130,
                width: 120,
                height: 120
            });
        }

        const pdfBytes = await pdfDoc.save();

        return pdfBytes;

    } catch (error) {
        console.error("PDF generation error:", error);
        throw error;
    }
}

module.exports = {
    generateCertificatePDF
};