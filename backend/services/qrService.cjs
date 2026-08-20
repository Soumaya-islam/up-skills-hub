const QRCode = require("qrcode");

async function generateCertificateQR(certificateNumber) {
    const verificationUrl =
        `${process.env.FRONTEND_URL}/verify/${certificateNumber}`;

    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: "H",
        width: 300,
        margin: 2
    });

    return {
        verificationUrl,
        qrDataUrl
    };
}

module.exports = {
    generateCertificateQR
};