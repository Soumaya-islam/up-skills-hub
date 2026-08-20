const mongoose = require("mongoose");

const CertificateTemplateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        logoPath: {
            type: String,
            default: null
        },

        templatePath: {
            type: String,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CertificateTemplate",
    CertificateTemplateSchema
);