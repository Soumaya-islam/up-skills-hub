const mongoose = require("mongoose");

const VerificationLogSchema = new mongoose.Schema(
    {
        certificateNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        result: {
            type: String,
            enum: [
                "Verified",
                "Not Found",
                "Revoked",
                "Failed"
            ],
            required: true
        },

        ipAddress: {
            type: String,
            default: null
        },

        userAgent: {
            type: String,
            default: null
        },

        verifiedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "VerificationLog",
    VerificationLogSchema
);