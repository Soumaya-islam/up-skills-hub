const CertificateTemplate = require("../models/certificateTemplate.cjs");

// =====================================================
// CREATE TEMPLATE
// =====================================================

exports.createTemplate = async (req, res) => {
    try {
        const {
            name,
            description,
            logoPath,
            templatePath,
            isActive
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Template name is required"
            });
        }

        const template = new CertificateTemplate({
            name,
            description,
            logoPath,
            templatePath,
            isActive
        });

        await template.save();

        res.status(201).json({
            message: "Certificate template created successfully",
            template
        });

    } catch (error) {
        console.error("Create template error:", error);

        res.status(500).json({
            message: "Failed to create certificate template",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL TEMPLATES
// =====================================================

exports.getTemplates = async (req, res) => {
    try {
        const templates = await CertificateTemplate.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            templates
        });

    } catch (error) {
        console.error("Get templates error:", error);

        res.status(500).json({
            message: "Failed to retrieve certificate templates",
            error: error.message
        });
    }
};


// =====================================================
// GET ONE TEMPLATE
// =====================================================

exports.getTemplateById = async (req, res) => {
    try {
        const template = await CertificateTemplate.findById(
            req.params.id
        );

        if (!template) {
            return res.status(404).json({
                message: "Certificate template not found"
            });
        }

        res.status(200).json({
            template
        });

    } catch (error) {
        console.error("Get template error:", error);

        res.status(500).json({
            message: "Failed to retrieve certificate template",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE TEMPLATE
// =====================================================

exports.updateTemplate = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "logoPath",
            "templatePath",
            "isActive"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const template = await CertificateTemplate.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!template) {
            return res.status(404).json({
                message: "Certificate template not found"
            });
        }

        res.status(200).json({
            message: "Certificate template updated successfully",
            template
        });

    } catch (error) {
        console.error("Update template error:", error);

        res.status(500).json({
            message: "Failed to update certificate template",
            error: error.message
        });
    }
};


// =====================================================
// DELETE TEMPLATE
// =====================================================

exports.deleteTemplate = async (req, res) => {
    try {
        const template = await CertificateTemplate.findByIdAndDelete(
            req.params.id
        );

        if (!template) {
            return res.status(404).json({
                message: "Certificate template not found"
            });
        }

        res.status(200).json({
            message: "Certificate template deleted successfully"
        });

    } catch (error) {
        console.error("Delete template error:", error);

        res.status(500).json({
            message: "Failed to delete certificate template",
            error: error.message
        });
    }
};