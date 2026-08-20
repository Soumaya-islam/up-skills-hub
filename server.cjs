require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const certificateRoutes = require("./backend/routes/certificateRoutes.cjs");
const authRoutes = require("./backend/routes/authRoutes.cjs");
const certificateTemplateRoutes = require("./backend/routes/certificateTemplateRoutes.cjs");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/certificates", certificateRoutes);

app.use(
    "/api/certificate-templates",
    certificateTemplateRoutes
);

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Up-Skills Hub API is running",
        status: "success"
    });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        database:
            mongoose.connection.readyState === 1
                ? "connected"
                : "disconnected"
    });
});

// ===============================
// START SERVER
// ===============================

async function startServer() {
    try {
        if (!MONGO_URI) {
            console.error("MONGO_URI is missing from .env");
            process.exit(1);
        }

        console.log("Connecting to MongoDB Atlas...");

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 15000
        });

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(
                `Health check: http://localhost:${PORT}/api/health`
            );
            console.log(
                `Auth API: http://localhost:${PORT}/api/auth`
            );
            console.log(
                `Certificate API: http://localhost:${PORT}/api/certificates`
            );
            console.log(
                `Certificate Template API: http://localhost:${PORT}/api/certificate-templates`
            );
        });

    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();