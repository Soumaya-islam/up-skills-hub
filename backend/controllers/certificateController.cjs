const Certificate = require("../models/Certificate.cjs");
const QRCode = require("qrcode");
const VerificationLog = require("../models/VerificationLog.cjs");
const { generateCertificatePDF } = require("../services/pdfService.cjs");


// =====================================================
// CREATE CERTIFICATE
// =====================================================

exports.createCertificate = async (req, res) => {
    try {
        const {
            studentName,
            course,
            programCode,
            completionDate,
            issueDate
        } = req.body;

        if (!studentName || !course || !programCode || !completionDate) {
            return res.status(400).json({
                message:
                    "Student name, course, program code and completion date are required"
            });
        }

        const certificate = new Certificate({
            studentName,
            course,
            programCode,
            completionDate,
            issueDate
        });

        await certificate.save();

        const frontendUrl =
            process.env.FRONTEND_URL || "https://upskillshub.com";

        const verificationUrl =
            `${frontendUrl}/verify/${certificate.certificateNumber}`;

        const qrData = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: "H",
            width: 300,
            margin: 2
        });

        certificate.qrData = qrData;

        await certificate.save();

        res.status(201).json({
            message: "Certificate created successfully",
            certificate
        });

    } catch (error) {
        console.error("Create certificate error:", error);

        res.status(500).json({
            message: "Failed to create certificate",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL CERTIFICATES
// =====================================================

exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            certificates
        });

    } catch (error) {
        console.error("Get certificates error:", error);

        res.status(500).json({
            message: "Failed to retrieve certificates",
            error: error.message
        });
    }
};


// =====================================================
// GET ONE CERTIFICATE
// =====================================================

exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        res.status(200).json({
            certificate
        });

    } catch (error) {
        console.error("Get certificate error:", error);

        res.status(500).json({
            message: "Failed to retrieve certificate",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE CERTIFICATE
// =====================================================

exports.updateCertificate = async (req, res) => {
    try {
        const allowedFields = [
            "studentName",
            "course",
            "programCode",
            "completionDate",
            "issueDate",
            "status"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        res.status(200).json({
            message: "Certificate updated successfully",
            certificate
        });

    } catch (error) {
        console.error("Update certificate error:", error);

        res.status(500).json({
            message: "Failed to update certificate",
            error: error.message
        });
    }
};


// =====================================================
// DELETE CERTIFICATE
// =====================================================

exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(
            req.params.id
        );

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        res.status(200).json({
            message: "Certificate deleted successfully"
        });

    } catch (error) {
        console.error("Delete certificate error:", error);

        res.status(500).json({
            message: "Failed to delete certificate",
            error: error.message
        });
    }
};


// =====================================================
// VERIFY CERTIFICATE
// =====================================================

exports.verifyCertificate = async (req, res) => {
    try {
        const certificateNumber = req.params.certificateNumber
            .trim()
            .toUpperCase();

        const certificate = await Certificate.findOne({
            certificateNumber
        });

        if (!certificate) {
            await VerificationLog.create({
                certificateNumber,
                result: "Not Found",
                ipAddress: req.ip,
                userAgent: req.get("user-agent")
            });

            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        if (certificate.status === "Revoked") {
            await VerificationLog.create({
                certificateNumber,
                result: "Revoked",
                ipAddress: req.ip,
                userAgent: req.get("user-agent")
            });

            return res.status(403).json({
                message: "Certificate Revoked",
                certificateNumber: certificate.certificateNumber
            });
        }

        await VerificationLog.create({
            certificateNumber,
            result: "Verified",
            ipAddress: req.ip,
            userAgent: req.get("user-agent")
        });

        res.status(200).json({
            message: "Certificate Verified",

            certificate: {
                studentName: certificate.studentName,
                course: certificate.course,
                certificateNumber: certificate.certificateNumber,
                completionDate: certificate.completionDate,
                issueDate: certificate.issueDate,
                status: certificate.status
            }
        });

    } catch (error) {
        console.error("Verify certificate error:", error);

        res.status(500).json({
            message: "Certificate verification failed",
            error: error.message
        });
    }
};


// =====================================================
// DOWNLOAD CERTIFICATE PDF
// =====================================================

exports.downloadCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        const pdfBytes = await generateCertificatePDF(certificate);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${certificate.certificateNumber}.pdf"`
        );

        res.send(Buffer.from(pdfBytes));

    } catch (error) {
        console.error("Download certificate error:", error);

        res.status(500).json({
            message: "Failed to generate certificate PDF",
            error: error.message
        });
    }
};


// =====================================================
// REVOKE CERTIFICATE
// =====================================================

exports.revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        // Prevent revoking an already revoked certificate
        if (certificate.status === "Revoked") {
            return res.status(400).json({
                message: "Certificate is already revoked",
                certificate
            });
        }

        certificate.status = "Revoked";

        await certificate.save();

        // Record revoke action
        await VerificationLog.create({
            certificateNumber: certificate.certificateNumber,
            result: "Revoked",
            ipAddress: req.ip,
            userAgent: req.get("user-agent")
        });

        res.status(200).json({
            message: "Certificate revoked successfully",
            certificate
        });

    } catch (error) {
        console.error("Revoke certificate error:", error);

        res.status(500).json({
            message: "Failed to revoke certificate",
            error: error.message
        });
    }
};