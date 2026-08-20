const express = require("express");

const {
    createCertificate,
    getCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
    verifyCertificate,
    downloadCertificate,
    revokeCertificate
} = require("../controllers/certificateController.cjs");

const {
    authenticate,
    requireAdmin
} = require("../middleware/auth.cjs");

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

// Public certificate verification
router.get(
    "/verify/:certificateNumber",
    verifyCertificate
);

// Public PDF download
router.get(
    "/:id/download",
    downloadCertificate
);


// =====================================================
// ADMIN PROTECTED ROUTES
// =====================================================

// Get all certificates
router.get(
    "/",
    authenticate,
    requireAdmin,
    getCertificates
);

// Get one certificate
router.get(
    "/:id",
    authenticate,
    requireAdmin,
    getCertificateById
);

// Create certificate
router.post(
    "/",
    authenticate,
    requireAdmin,
    createCertificate
);

// Update certificate
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    updateCertificate
);

// Delete certificate
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    deleteCertificate
);

// Revoke certificate
router.patch(
    "/:id/revoke",
    authenticate,
    requireAdmin,
    revokeCertificate
);

module.exports = router;