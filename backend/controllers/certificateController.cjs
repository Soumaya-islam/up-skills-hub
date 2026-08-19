const Certificate = require("../models/Certificate.cjs");

// CREATE certificate
exports.createCertificate = async (req, res) => {
    try {
        const {
            studentName,
            course,
            programCode,
            completionDate,
            issueDate,
            qrData
        } = req.body;

        if (!studentName || !course || !programCode || !completionDate) {
            return res.status(400).json({
                message: "Student name, course, program code and completion date are required"
            });
        }

        const certificate = new Certificate({
            studentName,
            course,
            programCode,
            completionDate,
            issueDate,
            qrData
        });

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


// GET all certificates
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


// GET one certificate by ID
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


// UPDATE certificate
exports.updateCertificate = async (req, res) => {
    try {
        // Certificate number is deliberately excluded.
        // It cannot be changed after creation.
        const allowedFields = [
            "studentName",
            "course",
            "programCode",
            "completionDate",
            "issueDate",
            "status",
            "qrData"
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


// DELETE certificate
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


// VERIFY certificate by certificate number
exports.verifyCertificate = async (req, res) => {
    try {
        const certificateNumber = req.params.certificateNumber
            .trim()
            .toUpperCase();

        const certificate = await Certificate.findOne({
            certificateNumber
        });

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found"
            });
        }

        if (certificate.status === "Revoked") {
            return res.status(403).json({
                message: "Certificate Revoked",
                certificateNumber: certificate.certificateNumber
            });
        }

        res.status(200).json({
            message: "Certificate Verified",
            certificate: {
                studentName: certificate.studentName,
                course: certificate.course,
                certificateNumber: certificate.certificateNumber,
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