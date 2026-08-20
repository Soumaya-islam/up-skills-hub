const mongoose = require("mongoose");
const Counter = require("./Counter.cjs");

const CertificateSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        course: {
            type: String,
            required: true,
            trim: true
        },

        programCode: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        certificateNumber: {
            type: String,
            unique: true,
            immutable: true,
            trim: true
        },

        completionDate: {
            type: Date,
            required: true
        },

        issueDate: {
            type: Date,
            required: true,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["Active", "Revoked"],
            default: "Active"
        },

        qrData: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);


// Automatically generate unique certificate number
CertificateSchema.pre("save", async function () {

    // Don't generate another number when updating
    if (!this.isNew || this.certificateNumber) {
        return;
    }

    const year = new Date().getFullYear();

    const counterName =
        `USH-${year}-${this.programCode}`;

    const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { seq: 1 } },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    );

    const sequence =
        String(counter.seq).padStart(6, "0");

    this.certificateNumber =
        `USH-${year}-${this.programCode}-${sequence}`;
});


module.exports = mongoose.model(
    "Certificate",
    CertificateSchema
);