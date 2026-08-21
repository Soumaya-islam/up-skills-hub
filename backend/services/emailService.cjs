const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendCertificateEmail({
    to,
    studentName,
    certificateNumber,
    pdfBytes
}) {
    if (!to) {
        throw new Error("Student email is required");
    }

    if (!pdfBytes) {
        throw new Error("Certificate PDF is required");
    }

    const frontendUrl =
        process.env.FRONTEND_URL || "http://localhost:3000";

    const verificationUrl =
        `${frontendUrl}/verify/${certificateNumber}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject: "Your Up-Skills Hub Certificate",

        text: `Congratulations ${studentName}!

You have successfully completed your program.

Your certificate number is: ${certificateNumber}

You can verify your certificate here:
${verificationUrl}

Your certificate PDF is attached to this email.

Congratulations from Up-Skills Hub!`,

        html: `
            <h2>Congratulations, ${studentName}!</h2>

            <p>
                You have successfully completed your program.
            </p>

            <p>
                <strong>Certificate Number:</strong>
                ${certificateNumber}
            </p>

            <p>
                You can verify your certificate here:
            </p>

            <p>
                <a href="${verificationUrl}">
                    Verify Certificate
                </a>
            </p>

            <p>
                Your certificate PDF is attached to this email.
            </p>

            <p>
                Congratulations from <strong>Up-Skills Hub!</strong>
            </p>
        `,

        attachments: [
            {
                filename: `Certificate-${certificateNumber}.pdf`,
                content: Buffer.from(pdfBytes),
                contentType: "application/pdf"
            }
        ]
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendCertificateEmail
};