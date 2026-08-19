const mongoose = require("mongoose");

// Counter used to generate automatic certificate numbers
const CounterSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const Counter = mongoose.model("CertificateCounter", CounterSchema);

// Certificate schema
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

// Automatically generate certificate number when creating a certificate
CertificateSchema.pre("save", async function (next) {
    try {
        if (!this.isNew || this.certificateNumber) {
            return next();
        }

        const year = new Date().getFullYear();
        const key = `USH-${year}-${this.programCode}`;

        const counter = await Counter.findOneAndUpdate(
            { key },
            { $inc: { seq: 1 } },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        const sequence = String(counter.seq).padStart(6, "0");

        this.certificateNumber = `USH-${year}-${this.programCode}-${sequence}`;

        next();
    } catch (error) {
        next(error);
    }
});

const Certificate = mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;